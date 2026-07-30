const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "2026-2027";

// Comitato Territoriale Basso Tirreno (Pisa-Livorno-Grosseto), pagina campionati "normali".
// NON quello con la "M" (10M52), che è la sezione Minivolley e non ha calendari/risultati.
const COMITATO = "10052";

function stagioneToSeasonId(stagione) {
  // Verificato dal menu "Cambia stagione" del sito: 2014/2015 -> 9, ... 2026/2027 -> 21
  const startYear = parseInt(stagione.split("-")[0], 10);
  return startYear - 2005;
}

function calcolaStagione(dataGara) {
  const match = dataGara.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return STAGIONE;
  const mese = parseInt(match[2], 10);
  const anno = parseInt(match[3], 10);
  if (mese >= 7) return `${anno}-${anno + 1}`;
  return `${anno - 1}-${anno}`;
}

// Fase 1: trova SOLO gli ID dei gironi che appartengono davvero al Basso Tirreno,
// per la stagione richiesta, leggendo la pagina ufficiale del comitato.
async function trovaGironiComitato(stagione, browser) {
  const page = await browser.newPage();
  const gironiIds = new Set();
  try {
    // Prima visita: imposta il comitato Basso Tirreno nella sessione del sito
    await page.goto(`https://fipavonline.it/main/tutti_i_campionati/${COMITATO}`, {
      waitUntil: "domcontentloaded",
      timeout: 20000
    });

    // Seconda visita: cambia la stagione mantenendo il comitato in sessione
    const seasonId = stagioneToSeasonId(stagione);
    await page.goto(`https://fipavonline.it/main/cambia_stagione/${seasonId}/tutti_i_campionati`, {
      waitUntil: "domcontentloaded",
      timeout: 20000
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    $('a[href*="gare_girone/"]').each((i, el) => {
      const href = $(el).attr("href") || "";
      const match = href.match(/gare_girone\/(\d+)/);
      if (match) gironiIds.add(parseInt(match[1], 10));
    });
  } finally {
    await page.close();
  }
  return Array.from(gironiIds);
}

// Fase 2: legge il dettaglio (squadre + calendario) di UN girone già identificato come Basso Tirreno.
async function leggiGirone(id, browser) {
  const page = await browser.newPage();

  try {
    const url = `https://fipavonline.it/main/gare_girone/${id}/1`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    const html = await page.content();
    const $ = cheerio.load(html);

    const titoloCompleto = $(".h3-wrap").first().text().trim();
    if (!titoloCompleto) return null;

    const nomeGirone = titoloCompleto.split("/").shift().trim();
    const campionato = nomeGirone.replace(/\s*-\s*Girone\s+[A-Z0-9]+.*/i, "").trim();
    const matchGirone = nomeGirone.match(/Girone\s+[A-Z0-9]+/i);
    const girone = matchGirone ? matchGirone[0] : "";

    const squadreSet = new Set();
    $(".sq-nLong").each((i, el) => {
      const squadra = $(el).text().trim();
      if (squadra && squadra !== "Riposa") squadreSet.add(squadra);
    });

    if (!campionato || squadreSet.size === 0) return null;

    const calendario = [];
    $(".risultati").each((i, gara) => {
      const numero = $(gara).find(".info-gara-giornata").first().text().trim();
      if (!numero) return;
      const squadre = $(gara).find(".sq-nLong");
      if (squadre.length < 2) return;
      const risultato = $(gara).find(".s-scoreText").first().text().trim();
      const setParziali = $(gara).find(".s-scoreDett").first().text().trim();

      calendario.push({
        gara: numero,
        data: $(gara).find(".info-gara-data").first().text().trim(),
        casa: $(squadre[0]).text().trim(),
        ospite: $(squadre[1]).text().trim(),
        risultato,
        set: setParziali || ""
      });
    });

    const viste = new Set();
    const calendarioPulito = calendario.filter(g => {
      const chiave = [g.gara, g.data, g.casa, g.ospite].join("|");
      if (viste.has(chiave)) return false;
      viste.add(chiave);
      return true;
    });

    const primaData = calendarioPulito.length > 0 ? calendarioPulito[0].data : "";
    const stagioneReale = calcolaStagione(primaData);

    return {
      stagione: stagioneReale,
      campionato,
      girone,
      id,
      nome: nomeGirone,
      url,
      squadre: Array.from(squadreSet),
      calendario: calendarioPulito
    };
  } catch {
    return null;
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  console.log(`Comitato Basso Tirreno (${COMITATO}) — stagione ${STAGIONE}`);
  console.log("Cerco l'elenco ufficiale dei gironi per questa stagione...");

  const ids = await trovaGironiComitato(STAGIONE, browser);
  console.log(`Trovati ${ids.length} gironi ufficiali del Basso Tirreno per la stagione ${STAGIONE}.`);

  const gironi = [];
  for (const id of ids) {
    const dati = await leggiGirone(id, browser);
    if (dati && dati.nome && dati.campionato) {
      gironi.push(dati);
      console.log(`OK ${id} - ${dati.nome}`);
    } else {
      console.log(`Vuoto/non valido: ${id}`);
    }
  }

  await browser.close();

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    `data/${STAGIONE}.json`,
    JSON.stringify({ aggiornamento: new Date().toISOString(), totale: gironi.length, gironi }, null, 2),
    "utf8"
  );

  console.log(`Salvati ${gironi.length} gironi in data/${STAGIONE}.json`);
})();
