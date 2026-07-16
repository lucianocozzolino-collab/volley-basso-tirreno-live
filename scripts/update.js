const fs = require("fs");

const gironi = [];

for (let id = 59750; id <= 59780; id++) {

    gironi.push({
        id: id.toString(),
        url: `https://fipavonline.it/main/gare_girone/${id}`
    });

}

fs.writeFileSync(
    "data/test-gironi.json",
    JSON.stringify(gironi, null, 2)
);

console.log("Test completato");
