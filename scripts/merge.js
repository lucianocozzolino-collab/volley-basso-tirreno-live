const fs = require("fs");
const path = require("path");

const DATA_DIR = "data";

const files = fs
  .readdirSync(DATA_DIR)
  .filter(f => f.endsWith(".json"));

let tuttiGironi = [];

for (const file of files) {

  const contenuto = JSON.parse(
    fs.readFileSync(
      path.join(DATA_DIR, file),
      "utf8"
    )
  );

  if (contenuto.gironi) {
    tuttiGironi.push(
      ...contenuto.gironi
    );
  }

}

const output = {
  aggiornamento: new Date().toISOString(),
  totale: tuttiGironi.length,
  gironi: tuttiGironi
};

fs.mkdirSync("docs", {
  recursive: true
});

fs.writeFileSync(
  "docs/data.json",
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
