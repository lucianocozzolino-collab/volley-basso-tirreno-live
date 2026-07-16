const fs = require("fs");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

async function leggiGirone(id) {

    const browser =
        await chromium.launch({
            headless: true
        });

    const page =
        await browser.newPage();

    await page.goto(
        `https://fipavonline.it/main/gare_girone/${id}`,
        {
            waitUntil: "networkidle",
            timeout: 60000
        }
    );

    const html =
        await page.content();

    await browser.close();

    const $ =
        cheerio.load(html);

    const titolo =
        $(".h3-wrap")
        .first()
        .text()
        .trim();

    return {
        id,
        nome: titolo,
        url:
          `https://fipavonline.it/main/gare_girone/${id}`
    };
}

(async () => {

    const ids = [
        59761,
        59764,
        59767
    ];

    const gironi = [];

    for (const id of ids) {

        try {

            const dati =
                await leggiGirone(id);

            gironi.push(dati);

            console.log(
                "OK",
                dati.nome
            );

        } catch (err) {

            console.log(
                "Errore",
                id
            );
        }
    }

    fs.writeFileSync(
        "data/gironi.json",
        JSON.stringify(
            {
                aggiornamento:
                    new Date().toISOString(),
                gironi
            },
            null,
            2
        )
    );

})();
