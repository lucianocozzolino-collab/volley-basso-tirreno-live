const fs = require("fs");

const test = {
  data: new Date().toISOString(),
  messaggio: "Workflow funzionante"
};

fs.writeFileSync(
  "data/test.json",
  JSON.stringify(test, null, 2)
);

console.log("OK");
