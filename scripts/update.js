const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "ALL";

const RANGE = {
  ALL: {
    min: 61500,
    max: 68000
  },

  "2026-2027": {
    min: 66500,
    max: 68000
  },

  "2025-2026": {
    min: 61500,
    max: 68000
  },

  "2024-2025": {
    min: 61500,
    max: 63600
  }
};

if (!RANGE[STAGIONE]) {
  console.error(`Stagione non supportata: ${STAGIONE}`);
  process.exit(1);
}

const ID_MIN = RANGE[STAGIONE].min;
const ID_MAX = RANGE[STAGIONE].max;

async function leggiGirone(id, browser) {
  const page = await browser.newPage();

  try {
    const url = `https://fipavonline.it/main/gare_girone/${id}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 3000
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const titoloCompleto = $(".h3-wrap")
      .first()
      .text()
      .trim();

    if (!titoloCompleto) {
      return null;
    }

    const nomeGirone = titoloCompleto
      .split("/")
      .shift()
      .trim();

    const campionato = nomeGirone
      .replace(/\s*-\s*Girone\s+[A-Z0-9]+.*/i, "")
      .trim();

    const match = nomeGirone.match(
      /Girone\s+[A-Z0-9]+/i
    );

    const girone = match ? match[0] : "";

    const squadreSet = new Set();

    $(".sq-nLong").each((i, el) => {
      const squadra = $(el)
        .text()
        .trim();

      if (
        squadra &&
        squadra !== "Riposa"
      ) {
        squadreSet.add(squadra);
      }
    });

    if (
      !campionato ||
      !girone ||
      squadreSet.size === 0
    ) {
      return null;
    }

    const calendario = [];

    $(".risultati").each((i, gara) => {
      const numero = $(gara)
        .find(".info-gara-giornata")
        .first()
        .text()
        .trim();

      if (!numero) {
        return;
      }

      const squadre = $(gara)
        .find(".sq-nLong");

      if (squadre.length < 2) {
        return;
      }

      const risultato = $(gara)
        .find(".s-scoreText")
        .first()
        .text()
        .trim();

      const setParziali = $(gara)
        .find(".s-scoreDett")
        .first()
        .text()
        .trim();

      calendario.push({
        gara: numero,

        data: $(gara)
          .find(".info-gara-data")
          .first()
          .text()
          .trim(),

        casa: $(squadre[0])
          .text()
          .trim(),

        ospite: $(squadre[1])
          .text()
          .trim(),

        risultato,

        set: setParziali || ""
      });
    });

    const viste = new Set();

    const calendarioPulito = calendario.filter(g => {
      const chiave = [
        g.gara,
        g.data,
        g.casa,
        g.ospite
      ].join("|");

      if (viste.has(chiave)) {
        return false;
      }

      viste.add(chiave);
      return true;
    });

    return {
      stagione: STAGIONE,
      campionato,
      girone,
      id,
      nome: nomeGirone,
      url,
      squadre: Array.from(squadreSet),
      calendario: calendarioPulito
    };
  } catch (error) {
    return null;
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const gironi = [];

  console.log(`Avvio scansione stagione ${STAGIONE}`);
  console.log(`Range ID ${ID_MIN}-${ID_MAX}`);

  for (let id = ID_MIN; id <= ID_MAX; id++) {
    if (id % 100 === 0) {
      console.log(`Analizzo ID ${id}`);
    }

    const dati = await leggiGirone(
      id,
      browser
    );

    if (
      dati &&
      dati.nome &&
      dati.campionato &&
      dati.girone &&
      dati.squadre.length > 0
    ) {
      gironi.push(dati);

      console.log(
        `Trovato ${id} - ${dati.nome}`
      );
    }
  }

  const idsTrovati = gironi.map(g => g.id);

  if (idsTrovati.length > 0) {
    console.log(
      `MIN ID TROVATO: ${Math.min(...idsTrovati)}`
    );

    console.log(
      `MAX ID TROVATO: ${Math.max(...idsTrovati)}`
    );
  }

  await browser.close();

  fs.mkdirSync("data", {
    recursive: true
  });

  fs.writeFileSync(
    `data/${STAGIONE}.json`,
    JSON.stringify(
      {
        aggiornamento: new Date().toISOString(),
        totale: gironi.length,
        gironi
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `Salvati ${gironi.length} gironi per ${STAGIONE}`
  );
})();
