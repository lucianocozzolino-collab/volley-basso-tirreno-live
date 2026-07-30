const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const BASE = "https://www.bassotirreno.federvolley.it/web/archivio-news.html";
const MAX_NEWS = 12; // quante notizie recenti tenere

function estraiData($) {
  // Le pagine Joomla mostrano di solito la data vicino al titolo dell'articolo
  // (es. "Pubblicato: 27 Luglio 2026" o simile). Proviamo qualche pattern comune;
  // se non trova nulla, lascia il campo vuoto invece di inventare una data.
  const testo = $("body").text();
  const match = testo.match(/(\d{1,2}\s+(?:Gennaio|Febbraio|Marzo|Aprile|Maggio|Giugno|Luglio|Agosto|Settembre|Ottobre|Novembre|Dicembre)\s+\d{4})/i)
    || testo.match(/(\d{2}\/\d{2}\/\d{4})/);
  return match ? match[1] : "";
}

async function leggiArticolo(url, browser) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    return { data: estraiData($) };
  } catch {
    return { data: "" };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Leggo l'elenco news del Basso Tirreno...");
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 20000 });
  const html = await page.content();
  const $ = cheerio.load(html);

  const viste = new Set();
  const notizie = [];

  $('a[href*="/notizie/"]').each((i, el) => {
    if (notizie.length >= MAX_NEWS) return;
    const href = $(el).attr("href");
    const titolo = $(el).text().trim();
    if (!href || !titolo || viste.has(href)) return;
    viste.add(href);
    const url = href.startsWith("http") ? href : `https://www.bassotirreno.federvolley.it${href}`;
    notizie.push({ titolo, url });
  });

  console.log(`Trovate ${notizie.length} notizie, leggo la data di ciascuna...`);

  for (const n of notizie) {
    const dettagli = await leggiArticolo(n.url, browser);
    n.data = dettagli.data;
    console.log(`- ${n.titolo} (${n.data || "data non trovata"})`);
  }

  await browser.close();

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    "data/news.json",
    JSON.stringify({ aggiornamento: new Date().toISOString(), notizie }, null, 2),
    "utf8"
  );
  console.log(`Salvate ${notizie.length} notizie in data/news.json`);
})();
