const fs = require("fs");
const path = require("path");

const DATA_DIR = "data";

function calcolaStagione(dataGara) {

  if (!dataGara) {
    return null;
  }

  const match =
    dataGara.match(
      /(\d{2})\/(\d{2})\/(\d{4})/
    );

  if (!match) {
    return null;
  }

  const giorno =
    parseInt(match[1], 10);

  const mese =
    parseInt(match[2], 10);

  const anno =
    parseInt(match[3], 10);

  if (
    Number.isNaN(giorno) ||
    Number.isNaN(mese) ||
    Number.isNaN(anno)
  ) {
    return null;
  }

  if (mese >= 7) {
    return `${anno}-${anno + 1}`;
  }

  return `${anno - 1}-${anno}`;
}

const files = fs
  .readdirSync(DATA_DIR)
  .filter(
    f =>
      f.endsWith(".json") &&
      f !== "archivio.json"
  );

let tuttiGironi = [];

for (const file of files) {

  const contenuto = JSON.parse(
    fs.readFileSync(
      path.join(DATA_DIR, file),
      "utf8"
    )
  );

  if (
    contenuto &&
    contenuto.gironi
  ) {

    tuttiGironi.push(
      ...contenuto.gironi
    );

  }

}

for (const girone of tuttiGironi) {

  if (
    girone.calendario &&
    girone.calendario.length > 0
  ) {

    const primaData =
      girone.calendario[0].data;

    const stagione =
      calcolaStagione(
        primaData
      );

    if (stagione) {
      girone.stagione =
        stagione;
    }

  }

}

const stagioni = {};

for (const girone of tuttiGironi) {

  const stagione =
    girone.stagione ||
    "SENZA_STAGIONE";

  if (!stagioni[stagione]) {
    stagioni[stagione] = [];
  }

  stagioni[stagione].push(
    girone
  );

}

for (const stagione of Object.keys(stagioni)) {

  fs.writeFileSync(
    path.join(
      DATA_DIR,
      `${stagione}.json`
    ),
    JSON.stringify(
      {
        aggiornamento:
          new Date().toISOString(),

        totale:
          stagioni[stagione].length,

        gironi:
          stagioni[stagione]
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `${stagione}: ${stagioni[stagione].length} gironi`
  );

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
