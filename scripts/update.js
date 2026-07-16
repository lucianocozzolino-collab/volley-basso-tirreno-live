const fs = require("fs");

async function main() {

  const id = 59767;

  const url =
    `https://fipavonline.it/main/gare_girone/${id}`;

  const response =
    await fetch(url);

  const html =
    await response.text();

  fs.mkdirSync("data", {
    recursive: true
  });

  fs.writeFileSync(
    "data/test-html.html",
    html
  );

  console.log("HTML salvato");
}

main();
