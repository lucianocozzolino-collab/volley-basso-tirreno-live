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

    const titolo =
      $(".h3-wrap").first().text().trim();

    if (!titolo) {
      return null;
    }

    return {
      id,
      nome: titolo
    };

  } finally {

    await page.close();

  }
}
