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
    const gareViste = new Set();

    $(".risultati").each((i, gara) => {

      const numero =
        $(gara)
          .find(".info-gara-giornata")
          .first()
          .text()
          .trim();

      if (!numero) return;

      if (gareViste.has(numero)) return;

      gareViste.add(numero);

      const data =
        $(gara)
          .find(".info-gara-data")
          .first()
          .text()
          .trim();

      const squadre =
        $(gara)
          .find(".sq-nLong");

      if (squadre.length < 2) return;

      calendario.push({
        gara: numero,
        data: data,
        casa: $(squadre[0]).text().trim(),
        ospite: $(squadre[1]).text().trim(),
        risultato:
          $(gara)
            .find(".s-scoreText")
            .first()
            .text()
            .trim()
      });

    });

    const classifica = [];

    $(".classifica tbody tr").each((i, riga) => {

      const td = $(riga).find("td");

      if (td.length >= 4) {

        classifica.push({
          posizione: $(td[0]).text().trim(),
          squadra: $(td[1]).text().trim(),
          punti: $(td[2]).text().trim(),
          gare: $(td[3]).text().trim()
        });

      }

    });

    const risultatiUltimaGiornata = [];

    if (calendario.length > 0) {

      const ultimaData =
        [...new Set(calendario.map(g => g.data))]
          .sort()
          .pop();

      calendario.forEach(gara => {

        if (gara.data === ultimaData) {

          risultatiUltimaGiornata.push(gara);

        }

      });

    }

    const prossimeGare = [];

    calendario.forEach(gara => {

      if (
        gara.risultato === "-" ||
        gara.risultato === ""
      ) {

        prossimeGare.push(gara);

      }

    });

    return {

      id: id,

      nome: nomeGirone,

      url:
        `https://fipavonline.it/main/gare_girone/${id}`,

      squadre:
        Array.from(squadreSet),

      classifica:
        classifica,

      risultatiUltimaGiornata:
        risultatiUltimaGiornata,

      prossimeGare:
        prossimeGare,

      calendario:
        calendario

    };

  } catch (err) {

    console.error(
      `Errore girone ${id}:`,
      err.message
    );

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
    ),
    "utf8"
  );

  console.log(
    "gironi.json aggiornato"
  );

})();
