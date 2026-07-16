const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

(async () => {

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto(
    "https://fipavonline.it/main/tutti_i_campionati",
    {
      waitUntil: "networkidle"
    }
  );

  const html = await page.content();

  const $ = cheerio.load(html);

  const campionati = [];

  $("a").each((i, el) => {

    const href = $(el).attr("href") || "";

    if (
      href.includes("/gare_girone/")
    ) {

      const id =
        href.match(/\d+/)?.[0];

      const nome =
        $(el).text().trim();

      if (id && nome) {

        campionati.push({

          id: parseInt(id),

          nome

        });

      }

    }

  });

  fs.writeFileSync(
    "data/campionati.json",
    JSON.stringify(
      campionati,
      null,
      2
    )
  );

  await browser.close();

})();
