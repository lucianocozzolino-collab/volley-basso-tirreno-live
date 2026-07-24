const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

(async () => {

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  console.log("Apro elenco campionati Basso Tirreno");

  await page.goto(
    "https://fipavonline.it/main/tutti_i_campionati",
    {
      waitUntil: "domcontentloaded",
      timeout: 30000
    }
  );

  const html = await page.content();

  const $ = cheerio.load(html);

  const linkGironi = [];

  $("a").each((i, el) => {

    const href = $(el).attr("href");

    if (
      href &&
      href.includes("/main/gare_girone/")
    ) {

      const url = href.startsWith("http")
        ? href
        : `https://fipavonline.it${href}`;

      linkGironi.push({
        nome: $(el).text().trim(),
        url
      });

    }

  });

  await browser.close();

  const unici = [];

  const visti = new Set();

  for (const item of linkGironi) {

    if (!visti.has(item.url)) {

      visti.add(item.url);

      unici.push(item);

    }

  }

  fs.mkdirSync("data", {
    recursive: true
  });

  fs.writeFileSync(
    "data/campionati-basso-tirreno.json",
    JSON.stringify(
      {
        aggiornamento:
          new Date().toISOString(),

        totale:
          unici.length,

        campionati:
          unici
      },
      null,
      2
    )
  );

  console.log(
    `Trovati ${unici.length} link ai gironi`
  );

})();
