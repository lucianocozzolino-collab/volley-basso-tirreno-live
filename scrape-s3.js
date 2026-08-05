const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "2025-2026";

// Elenco ufficiale dei gironi Volley S3 / Minivolley del Comitato Basso Tirreno
// per la stagione 2025-2026, estratto dalla pagina:
// https://fipavonline.it/main/tutti_i_campionati/10M52
// (il comitato "10M52" con la M è proprio la sezione minivolley — diversa da
// "10052" usata da scrape-fipav.js per i campionati normali)
//
// Come per l'altro scraper: quando cambia la stagione va ripetuta la procedura
// (salvare la pagina con la nuova stagione selezionata, mandarla a Claude).
const GIRONI_S3_BASSO_TIRRENO = {
  "2025-2026": [
    59762,59764,59765,59766,59767,59768,59769,59770,59771,59772,59773,59776,59817,59818,
    59874,59875,59917,59918,60728,60730,60731,60738,61216,61222,61465,61466,61467,61468,
    61469,61470,61471,61472,61474,61476,61478,61479,61509,61510,61511,61770,61773,61929,
    61930,61931,61932,62042,62043,62158,62161,62422,62424,62531,62633,62634,62635,62849,
    62850,63083,63086,63160
  ]
};

function calcolaStagione(dataGara) {
  const match = dataGara.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return STAGIONE;
  const mese = parseInt(match[2], 10);
  const anno = parseInt(match[3], 10);
  if (mese >= 7) return `${anno}-${anno + 1}`;
  return `${anno - 1}-${anno}`;
}

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
    $(".gare-wrap").each((gi, blocco) => {
      const titoloBlocco = $(blocco).find("h3").first().text().trim();
      const giornataMatch = titoloBlocco.match(/Giornata\s+(\d+)/i);
      const giornata = giornataMatch ? giornataMatch[1] : String(gi + 1);

      $(blocco).find(".risultati").each((i, gara) => {
        const codiceGara = $(gara).find(".info-gara-giornata").first().text().trim();
        const squadre = $(gara).find(".sq-nLong");
        if (squadre.length < 2) return;
        const risultato = $(gara).find(".s-scoreText").first().text().trim();
        const setParziali = $(gara).find(".s-scoreDett").first().text().trim();

        calendario.push({
          gara: giornata,
          codiceGara,
          data: $(gara).find(".info-gara-data").first().text().trim(),
          casa: $(squadre[0]).text().trim(),
          ospite: $(squadre[1]).text().trim(),
          risultato,
          set: setParziali || ""
        });
      });
    });

    const viste = new Set();
    const calendarioPulito = calendario.filter(g => {
      const chiave = g.codiceGara || [g.gara, g.data, g.casa, g.ospite].join("|");
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
  const ids = GIRONI_S3_BASSO_TIRRENO[STAGIONE];

  if (!ids) {
    console.error(`Nessun elenco di gironi S3 salvato per la stagione ${STAGIONE}.`);
    console.error(`Stagioni disponibili: ${Object.keys(GIRONI_S3_BASSO_TIRRENO).join(", ")}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  console.log(`Comitato Basso Tirreno — Volley S3/Minivolley — stagione ${STAGIONE} — ${ids.length} gironi da leggere`);

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
    `data/s3-${STAGIONE}.json`,
    JSON.stringify({ aggiornamento: new Date().toISOString(), totale: gironi.length, gironi }, null, 2),
    "utf8"
  );

  console.log(`Salvati ${gironi.length} gironi in data/s3-${STAGIONE}.json`);
})();
