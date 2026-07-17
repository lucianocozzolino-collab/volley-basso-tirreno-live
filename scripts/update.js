const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const FULL_SCAN = true;

function determinaStagione(id) {

  if (id < 53000) {
    return "2023-2024";
  }

  if (id < 59000) {
    return "2024-2025";
  }

  return "2025-2026";

}

async function leggiGirone(id, browser) {

  const page = await browser.newPage();

  try {

    await page.goto(
      `https://fipavonline.it/main/gare_girone/${id}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 15000
      }
    );

    const html = await page.content();

    const $ = cheerio.load(html);

    const titoloCompleto =
      $(".h3-wrap")
        .first()
        .text()
        .trim();

    if (!titoloCompleto) {
      return null;
    }

    const nomeGirone =
      titoloCompleto
        .split("/")
        .shift()
        .trim();

    const campionato =
      nomeGirone
        .replace(
          /\s*-\s*Girone\s+[A-Z0-9]+.*/i,
          ""
        )
        .trim();

    const gironeMatch =
      nomeGirone.match(
        /Girone\s+[A-Z0-9]+/i
      );

    const girone =
      gironeMatch
        ? gironeMatch[0]
        : "";

    const squadreSet = new Set();

    $(".sq-nLong").each((i, el) => {

      const squadra =
        $(el)
          .text()
          .trim();

      if (
        squadra &&
        squadra !== "Riposa"
      ) {
        squadreSet.add(squadra);
      }

    });

    const calendario = [];

    $(".risultati").each((i, gara) => {

      const numero =
        $(gara)
          .find(".info-gara-giornata")
          .first()
          .text()
          .trim();

      if (!numero) return;

      const squadre =
        $(gara)
          .find(".sq-nLong");

      if (squadre.length < 2)
        return;

      calendario.push({

        gara: numero,

        data:
          $(gara)
            .find(".info-gara-data")
            .first()
            .text()
            .trim(),

        casa:
          $(squadre[0])
            .text()
            .trim(),

        ospite:
          $(squadre[1])
            .text()
            .trim(),

        risultato:
          $(gara)
            .find(".s-scoreText")
            .first()
            .text()
            .trim()

      });

    });

    if (
      !campionato ||
      !girone ||
      squadreSet.size === 0
    ) {
      return null;
    }

    return {

      stagione:
        determinaStagione(id),

      campionato,

      girone,

      id,

      nome:
        nomeGirone,

      url:
        `https://fipavonline.it/main/gare_girone/${id}`,

      squadre:
        Array.from(
          squadreSet
        ),

      calendario

    };

  } catch {

    return null;

  } finally {

    await page.close();

  }

}

(async () => {

  const browser =
    await chromium.launch({
      headless: true
    });

  const ids = [];

  if (FULL_SCAN) {

    for (
      let id = 50000;
      id <= 65000;
      id++
    ) {

      ids.push(id);

    }

  } else {

    for (
      let id = 59000;
      id <= 65000;
      id++
    ) {

      ids.push(id);

    }

  }

  const gironi = [];

  for (const id of ids) {

    const dati =
      await leggiGirone(
        id,
        browser
      );

    if (dati) {

      gironi.push(dati);

      console.log(
        `Trovato ${id} - ${dati.nome}`
      );

    }

  }

  await browser.close();

  fs.mkdirSync(
    "data",
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    "data/gironi.json",
    JSON.stringify(
      {
        aggiornamento:
          new Date().toISOString(),

        totale:
          gironi.length,

        gironi
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `Salvati ${gironi.length} gironi`
  );

})();
