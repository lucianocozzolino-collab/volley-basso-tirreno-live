const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

async function leggiGirone(id, browser) {

  const page = await browser.newPage();

  try {

    await page.goto(
      `https://fipavonline.it/main/gare_girone/${id}`,
      {
        waitUntil: "networkidle",
        timeout: 60000
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
        .split("/")[0]
        .trim();

    const squadreSet = new Set();

    $(".sq-nLong").each((i, el) => {

      const nome =
        $(el)
          .text()
          .trim();

      if (
        nome &&
        nome !== "Riposa"
      ) {
        squadreSet.add(nome);
      }

    });

    const calendario = [];

    $(".risultati").each((i, gara) => {

      const data =
        $(gara)
          .find(".info-gara-data")
          .first()
          .text()
          .trim();

      const numero =
        $(gara)
          .find(".info-gara-giornata")
          .first()
          .text()
          .trim();

      const squadre =
        $(gara)
          .find(".sq-nLong");

      if (squadre.length >= 2) {

        calendario.push({

          gara: numero,

          data: data,

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

      }

    });

    return {

      id,

      nome: nomeGirone,

      url:
        `https://fipavonline.it/main/gare_girone/${id}`,

      squadre:
        Array.from(squadreSet),

      calendario

    };

  } catch (err) {

    console.log(`Errore girone ${id}`);

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

  const ids = [
    59761,
    59764,
    59767
  ];

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
        `Trovato: ${dati.nome}`
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
    )
  );

  console.log(
    "gironi.json aggiornato"
  );

})();
