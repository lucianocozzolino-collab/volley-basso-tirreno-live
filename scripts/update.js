const fs = require("fs");

const dati = {
  ultimoAggiornamento: new Date().toLocaleString("it-IT"),

  campionati: [
    {
      nome: "Volley S3 Under 12 6x6 F",
      girone: "59764",
      url: "https://fipavonline.it/main/gare_girone/59764"
    },
    {
      nome: "Prima Divisione Maschile",
      girone: "59761",
      url: "https://fipavonline.it/main/gare_girone/59761/1"
    }
  ]
};

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

fs.writeFileSync(
  "data/campionati.json",
  JSON.stringify(dati, null, 2)
);

console.log("Aggiornamento completato.");
