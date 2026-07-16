const fs = require("fs");
const { chromium } = require("playwright");

(async () => {

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto(
    "https://fipavonline.it/main/gare_girone/59764",
    {
      waitUntil: "networkidle"
    }
  );

  const html = await page.content();

  fs.writeFileSync(
    "data/playwright-test.html",
    html
  );

  await browser.close();

})();
