const fs = require("fs");

async function main() {

  const response = await fetch(
    "https://fipavonline.it/main/tutti_i_campionati",
    {
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    }
  );

  const html = await response.text();

  fs.mkdirSync("data", {
    recursive: true
  });

  fs.writeFileSync(
    "data/tutti_i_campionati.html",
    html
  );

  console.log("Pagina salvata");
}

main().catch(console.error);
