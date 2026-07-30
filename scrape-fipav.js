const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const STAGIONE = process.argv[2] || "2025-2026";

// Elenco ufficiale dei gironi del Comitato Territoriale Basso Tirreno (Pisa-Livorno-Grosseto)
// per la stagione 2025-2026, estratto a mano dalla pagina:
// https://fipavonline.it/main/tutti_i_campionati/10052
//
// Il tentativo di scoprire questi ID automaticamente cambiando stagione via URL
// (cambia_stagione/{id}/tutti_i_campionati) non ha funzionato: il sito gestisce
// il cambio stagione lato client (JavaScript), non con un link diretto scaricabile.
// Quando inizia una nuova stagione (2026-2027 e successive), va ripetuta questa
// procedura: salvare la pagina con la nuova stagione selezionata e rigenerare
// questa lista (chiedi a Claude di rifarlo, è una cosa da 2 minuti).
const GIRONI_BASSO_TIRRENO = {
  "2025-2026": [
    58773,58797,58798,58799,58913,58961,58962,58963,58964,59002,59144,59145,59147,59148,59149,59150,
    59151,59152,59243,59262,59545,59546,59547,59548,59549,59557,59591,59594,59609,59612,59613,59617,
    60010,60011,60270,60693,60756,60757,60758,60759,60760,60761,60787,60788,60789,60790,60817,60885,
    60886,60887,60888,60889,60890,60891,60892,60893,60894,60895,60896,60904,60905,60906,61045,61114,
    61139,61155,61163,61164,61165,61166,61208,61233,61243,61400,61401,61402,61403,61404,61405,61406,
    61407,61408,61480,61481,61482,61483,61484,61485,61486,61503,61515,61516,61517,61518,61519,61520,
    61793,61941,61942,62230,62231,62232,62233,62270,62274,62275,62276,62277,62284,62285,62303,62418,
    62594,62653,62654,62655,62791,62818,62819,62820,62821,62822,62887,63093,63116,63117,63118,63119,
    63120,63161,63163,63165,63170,63171,63172,63173,63174,63175,63176,63177,63178,63179,63180,63181,
    63182,63183,63184,63185,63186,63187,63188,63324,63325,63326,63328,63404,63414,63434,63435,63436,
    63437
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
  const ids = GIRONI_BASSO_TIRRENO[STAGIONE];

  if (!ids) {
    console.error(`Nessun elenco di gironi salvato per la stagione ${STAGIONE}.`);
    console.error(`Stagioni disponibili: ${Object.keys(GIRONI_BASSO_TIRRENO).join(", ")}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  console.log(`Comitato Basso Tirreno — stagione ${STAGIONE} — ${ids.length} gironi da leggere`);

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
