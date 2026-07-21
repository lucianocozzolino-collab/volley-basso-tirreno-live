const fs = require("fs");

const files = [
  "data/2024-2025.json",
  "data/2025-2026.json",
  "data/2026-2027.json"
];

const gironi = [];

for (const file of files) {

  if (!fs.existsSync(file)) {
    console.log(`File mancante: ${file}`);
    continue;
  }

  const dati = JSON.parse(
    fs.readFileSync(
      file,
      "utf8"
    )
  );

  if (
    dati &&
    Array.isArray(dati.gironi)
  ) {

    gironi.push(
      ...dati.gironi
    );

    console.log(
      `${file}: ${dati.gironi.length} gironi`
    );

  }

}

const output = {

  aggiornamento:
    new Date().toISOString(),

  totale:
    gironi.length,

  gironi

};

fs.writeFileSync(
  "data/gironi.json",
  JSON.stringify(
    output,
    null,
    2
  ),
  "utf8"
);

console.log(
  `Uniti ${gironi.length} gironi totali`
);
