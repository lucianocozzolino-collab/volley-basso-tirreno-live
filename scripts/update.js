const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "2025-2026";

async function leggiLinkBassoTirreno(browser) {

  const page = await browser.newPage();

  await page.goto(
    "https://fipavonline.it/main/tutti_i_campionati/10M52#13873",
    {
      waitUntil: "domcontentloaded",
      timeout: 30000
    }
  );

  console.log(
    "Pagina caricata, attendo caricamento JS..."
  );

  await page.waitForTimeout(5000);

  const html =
    await page.content();

  fs.writeFileSync(
    "debug.html",
    html,
    "utf8"
  );

  const links =
    await page.$$eval(
      'a[href*="gare_girone"]',
      els => els.map(el => el.href)
    );

  console.log(
    `Link trovati: ${links.length}`
  );

  await page.close();

  const ids = [];

  for (const href of links) {

    const match =
      href.match(
        /gare_girone\/(\d+)/
      );

    if (match) {

      ids.push(
        Number(match[1])
      );

    }

  }

  return [...new Set(ids)];

}

async function leggiGirone(id, browser) {

  const page = await browser.newPage();

  try {

    const url =
      `https://fipavonline.it/main/gare_girone/${id}`;

    await page.goto(
      url,
      {
        waitUntil: "domcontentloaded",
        timeout: 15000
      }
    );

    const html =
      await page.content();

    const $ =
      cheerio.load(html);

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

    const match =
      nomeGirone.match(
        /Girone\s+[A-Z0-9]+/i
      );

    const girone =
      match
        ? match[0]
        : "";

    const squadreSet =
      new Set();

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

    if (
      !campionato ||
      squadreSet.size === 0
    ) {
      return null;
    }

    const calendario =
      [];

    $(".risultati").each((i, gara) => {

      const numero =
        $(gara)
          .find(".info-gara-giornata")
          .first()
          .text()
          .trim();

      if (!numero) {
        return;
      }

      const squadre =
        $(gara)
          .find(".sq-nLong");

      if (
        squadre.length < 2
      ) {
        return;
      }

      const risultato =
        $(gara)
          .find(".s-scoreText")
          .first()
          .text()
          .trim();

      const setParziali =
        $(gara)
          .find(".s-scoreDett")
          .first()
          .text()
          .trim();

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

        risultato,

        set:
          setParziali || ""

      });

    });

    const viste =
      new Set();

    const calendarioPulito =
      calendario.filter(g => {

        const chiave = [
          g.gara,
          g.data,
          g.casa,
          g.ospite
        ].join("|");

        if (
          viste.has(chiave)
        ) {
          return false;
        }

        viste.add(chiave);

        return true;

      });

    return {

      stagione:
        STAGIONE,

      campionato,

      girone,

      id,

      nome:
        nomeGirone,

      url,

      squadre:
        Array.from(
          squadreSet
        ),

      calendario:
        calendarioPulito

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

  const gironi = [];

  console.log(
    "Lettura gironi CT Basso Tirreno..."
  );

  const ids =
    await leggiLinkBassoTirreno(
      browser
    );

  console.log(
    `Trovati ${ids.length} gironi`
  );

  for (const id of ids) {

    const dati =
      await leggiGirone(
        id,
        browser
      );

    if (
      dati &&
      dati.nome &&
      dati.campionato
    ) {

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
    `data/${STAGIONE}.json`,
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
