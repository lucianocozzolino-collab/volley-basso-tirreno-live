const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

async function leggiGirone(id, browser) {

    const page = await browser.newPage();

    try {

        await page.goto(
            `https://fipavonline.it/main/gare_girone/${id}`,
            {
                waitUntil: "networkidle",
                timeout: 30000
            }
        );

        const html = await page.content();

        const $ = cheerio.load(html);

        const titolo =
            $(".h3-wrap").first().text().trim();

        if (!titolo) {
            return null;
        }

        return {
            id,
            nome: titolo.split("/")[0].trim(),
            url: `https://fipavonline.it/main/gare_girone/${id}`
        };

    } finally {

        await page.close();

    }
}

(async () => {

    const browser =
        await chromium.launch({
            headless: true
        });

    const gironi = [];

    for (let id = 59750; id <= 59780; id++) {

        try {

            const risultato =
                await leggiGirone(id, browser);

            if (risultato) {

                console.log(
                    "Trovato:",
                    risultato.nome
                );

                gironi.push(risultato);
            }

        } catch (err) {

            console.log(
                "Errore ID",
                id
            );
        }
    }

    await browser.close();

    fs.writeFileSync(
        "data/gironi.json",
        JSON.stringify(
            {
                aggiornamento:
                    new Date().toISOString(),
                totale: gironi.length,
                gironi
            },
            null,
            2
        )
    );

})();
