const fs = require("fs");

async function controlla(id) {

    const url =
        `https://fipavonline.it/main/gare_girone/${id}`;

    try {

        const response =
            await fetch(url);

        const html =
            await response.text();

        if (
            html.includes("Girone") ||
            html.includes("VOLLEY")
        ) {

            return {
                id,
                url
            };
        }

    } catch {}

    return null;
}

(async () => {

    const validi = [];

    for (let id = 59750; id <= 59800; id++) {

        const risultato =
            await controlla(id);

        if (risultato) {

            validi.push(risultato);

            console.log(
                "Trovato",
                id
            );
        }
    }

    fs.writeFileSync(
        "data/gironi-validi.json",
        JSON.stringify(
            validi,
            null,
            2
        )
    );

})();
