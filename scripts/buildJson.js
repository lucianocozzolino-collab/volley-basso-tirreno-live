const fs = require("fs");

const gironi =
  JSON.parse(
    fs.readFileSync(
      "data/gironi_raw.json"
    )
  );

fs.writeFileSync(
  "data/gironi.json",
  JSON.stringify(
    {
      aggiornamento:
        new Date().toISOString(),

      totale:
        gironi.length,

      gironi
    },
    null,
    2
  )
);
