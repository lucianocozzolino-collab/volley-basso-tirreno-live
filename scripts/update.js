const fs = require("fs");

const gironi = {

  aggiornamento: new Date().toLocaleString("it-IT"),

  stagioni: {

    "2025/2026": {

      "VOLLEY S3 Under 12 6x6 F - Girone D": {
        id: "59767",
        url: "https://fipavonline.it/main/gare_girone/59767"
      },

      "VOLLEY S3 Under 12 6x6 F - Girone A": {
        id: "59764",
        url: "https://fipavonline.it/main/gare_girone/59764"
      },

      "Prima Divisione Maschile - Girone A": {
        id: "59761",
        url: "https://fipavonline.it/main/gare_girone/59761"
      }

    }

  }

};

fs.mkdirSync("data", { recursive: true });

fs.writeFileSync(
  "data/gironi.json",
  JSON.stringify(gironi, null, 2)
);

console.log("gironi.json aggiornato");
