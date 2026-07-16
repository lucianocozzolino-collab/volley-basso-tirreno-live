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
        .split("/")
        .shift()
        .trim();

    const campionato =
      nomeGirone.replace(
        /\s*-\s*Girone\s+[A-Z0-9]+.*/i,
        ""
      ).trim();

*   const gironeMatch =
      nomeG*rone.match(
        /Girone\s+[A-Z0-9]+/i
      );

    const girone *
      gironeMatch
        ? giron**atch[0]
        : "";

    const s*uadreSet = new Set();

    $(".sq-*Long").each((i, el) => {

      co*st s =
        $(el)
          .te*t()
          .trim();

      if (*        s &&
        s !== "Riposa*
      ) {
        squadreSet.add(*);
      }

    });

    const cal*ndario = [];

    const gareViste *
      new Set();

    $(".risulta*i").each((i, gara) => {

      con*t numero =
        $(gara)
       *  .find(".info-gara-giornata")
   *      .first()
          .text()
 *        .trim();

      if (!numer*) return;

      if (
        gare*iste.has(numero)
      ) return;

*     gareViste.add(numero);

     *const squadre =
        $(gara)
  *       .find(".sq-nLong");

      *f (
        squadre.length < 2
   *  ) return;

      calendario.push*{

        gara: numero,

        *ata:
          $(gara)
           *.find(".info-gara-data")
         *  .first()
            .text()
   *        .trim(),

        casa:
  *       $(squadre[0])
            .*ext()
            .trim(),

      * ospite:
          $(squadre[1])
 *          .text()
            .tri*(),

        risultato:
          *(gara)
            .find(".s-score*ext")
            .first()
       *    .text()
            .trim()

 *    });

    });

    return {

  *   stagione:
        "2025-2026",
*      campionato,

      girone,

*     id,

      nome:
        nome*irone,

      url:
        `https:*/fipavonline.it/main/gare_girone/$*id}`,

      squadre:
        Arra*.from(
          squadreSet
      * ),

      calendario

    };

  }*catch {

    return null;

  } fin*lly {

    await page.close();

  *

}

(async () => {

  const brows*r =
    await chromium.launch({
  *   headless: true
    });

  const*ids = [
    59761,
    59764,
    59767
  ];

  const gironi = [];

 *for (const id of ids) {

    const*dati =
      await leggiGirone(
  *     id,
        browser
      );
*    if (dati) {

      gironi.push*dati);

      console.log(
       *dati.nome
      );

    }

  }

  *wait browser.close();

  fs.mkdirS*nc(
    "data",
    {
      recurs*ve: true
    }
  );

  fs.writeFil*Sync(

    "data/gironi.json",

  * JSON.stringify(
      {
        a*giornamento:
          new Date()
*           .toISOString(),

      * totale:
          gironi.length,
*        gironi
      },
      null*
      2
    )

  );

})();
