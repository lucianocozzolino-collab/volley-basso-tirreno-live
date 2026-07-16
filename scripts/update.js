const fs = require("fs");

const dati = {
  aggiornamento: new Date().toLocaleString("it-IT"),

  gironi: [
    {
      nome: "VOLLEY S3 Under 12 6x6 F - Girone D",
      id: "59767",
      url: "https://fipavonline.it/main/gare_girone/59767"
    }
  ]
};

fs.mkdirSync("data", { recursive: true });

fs.writeFileSync(
  "data/gironi.json",
  JSON.stringify(dati, null, 2)
);

console.log("gironi.json aggiornato");
