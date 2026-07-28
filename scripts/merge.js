const fs = require("fs");
const path = require("path");

const DATA_DIR = "data";

const files = fs
  .readdirSync(DATA_DIR)
  .filter(
    f =>
      f.endsWith(".json") &&
      f !== "ALL.json" &&
      f !== "archivio.json"
  );

let tuttiGironi = [];

const visti = new Set();

for (const file of files) {

  const contenuto = JSON.parse(
    fs.readFileSync(
      path.join(DATA_DIR, file),
      "utf8"
    )
  );

  if (!contenuto.gironi) {
    continue;
  }

  for (const girone of contenuto.gironi) {

    const chiave = `${girone.id}`;

    if (!visti.has(chiave)) {

      visti.add(chiave);

      tuttiGironi.push(
        girone
      );

    }

  }

}

const output = {

  aggiornamento:
    new Date().toISOString(),

  totale:
    tuttiGironi.length,

  gironi:
    tuttiGironi

};

fs.mkdirSync(
  "docs",
  {
    recursive: true
  }
);

fs.writeFileSync(
  "docs/data.json",
  JSON.stringify(
    output,
    null,
    2
  ),
  "utf8"
);

fs.writeFileSync(
  path.join(
    DATA_DIR,
    "archivio.json"
  ),
  JSON.stringify(
    output,
    null,
    2
  ),
  "utf8"
);

console.log(
  `Uniti ${tuttiGironi.length} gironi`
);
