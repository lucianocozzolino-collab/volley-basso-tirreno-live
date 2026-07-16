const fs = re*uire("fs");
const cheerio = requir*("cheerio");
const { chromium } = *equire("playwright");

async funct*on leggiGirone(id, browser) {

  c*nst page = await browser.newPage()*

  try {

    await page.goto(
  *   `https://fipavonline.it/main/ga*e_girone/${id}`,
      {
        w*itUntil: "networkidle",
        ti*eout: 60000
      }
    );

    co*st html = await page.content();

 *  const $ = cheerio.load(html);

 *  const titolo =
      $(".h3-wrap*).first().text().trim();

    if (*titolo) {
      return null;
    }*
    const nomeGirone =
      tito*o.split("/")[0].trim();

    const*squadreSet = new Set();

    $(".s*-nLong").each((i, el) => {

      *onst nome =
        $(el).text().t*im();

      if (
        nome &&
*       nome !== "Riposa"
      ) {*        squadreSet.add(nome);
    * }

    });

    const calendario * [];

    $(".*isultati").each((i, gara* => {

      const data =
        *(gara)
          .find(".*nfo-gara-data")
          .first()*          .text()
          .*rim();

      const numero =
     *  $(gara)
          .*ind(".info-gara-giornata")
*         .first()
          .text(*
          .trim();

      const s*uadre =
        $(gara)
         *.*ind(".sq-nLong");

      if (squad*e.length >= 2) {

        calendar*o.push({

          gara: numero,
*          data: data,

          c*sa:
            $(squadre[0])
    *         .text()
              .tr*m(),

          osp*te*
            $(squadre[1])
       *      .text()
              .trim(*,

          risultato:
          * $(gara)
              .find(".s-s*oreText")
              .first()
 *            .text()
              *trim()

        });

      }

    *);

    return {

      id,

     *nome: nomeGirone,

      url:
    *   `https://fipavonline.it/main/ga*e_girone/${id}`,

      squadre:
 *      Array.from(squadreSet),

   *  calendario

    };

  } finally *

    await page.close();

  }
}

*async () => {

  const browser =
 *  await chromium.launch({
      he*dless: true
    });

  const ids =*[

    59761,
    59764,
    59767

  ];

  const gironi = [];

  for*(const id of ids) {

    try {

  *   const dati =
        await legg*Girone(
          id,
          br*wser
        );

      if (dati) {*
        gironi.push(dati);

     *  console.log(
          "Trovato:*,
          dati.nome
        );

*     }

    } catch (err) {

     *console.log(
        "Errore ID:",*        id
      );
    }
  }

  a*ait browser.close();

  fs.mkdirSy*c(
    "data",
    {
      recursi*e: true
    }
  );

  fs.writeFile*ync(

    "data/gironi.json",

   *JSON.stringify(
      {
        ag*iornamento:
          new Date().t*ISOString(),

        totale:
    *     gironi.length,

        giron*
      },
      null,
      2
    *
  );

  console.log(
    "gironi.*son aggiornato"
  );

})();
