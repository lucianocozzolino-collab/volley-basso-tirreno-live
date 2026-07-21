const fs = require("fs");

const tutteLeStagioni = [];

[
  "data/2024-2025.json",
  "data/2025-2026.json",
  "data/2026-2027.json"
].forEach(file => {

  if (fs.existsSync(file)) {

    const dati =
      JSON.parse(
        fs.readFileSync(
          file,
          "utf8"
        )
      );

    tutteLeStagioni.push(
      ...dati.gironi
    );

  }

});

fs.writeFileSync(

  "data/gironi.json",

  JSON.stringify(
    {
      aggiornamento:
        new Date().toISOString(),

      totale:
        tutteLeStagioni.length,

      gironi:
        tutteLeStagioni
    },
    null,
    2
  ),
  "utf8"

);

console.log(
  `Uniti ${tutteLeStagioni.length} gironi`
);
