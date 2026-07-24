const fs = require("fs");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "ALL";

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

  fs.mkdirSync(
    "data",
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    "data/debug.html",
    html,
    "utf8"
  );

  console.log(
    `HTML salvato: ${html.length} caratteri`
  );

  const links =
    await page.$$eval(
      'a[href*="gare_girone"]',
      els => els.map(
        el => el.href
      )
    );

  console.log(
    `Link trovati: ${links.length}`
  );

  await page.close();

  return links;

}

(async () => {

  const browser =
    await chromium.launch({
      headless: true
    });

  console.log(
    "Lettura gironi CT Basso Tirreno..."
  );

  const links =
    await leggiLinkBassoTirreno(
      browser
    );

  console.log(
    "Link trovati:"
  );

  console.log(
    JSON.stringify(
      links,
      null,
      2
    )
  );

  await browser.close();

  fs.writeFileSync(
    `data/${STAGIONE}.json`,
    JSON.stringify(
      {
        aggiornamento:
          new Date().toISOString(),
        totale:
          links.length,
        links
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `Salvati ${links.length} link`
  );

})();
