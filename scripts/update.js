const fs = require("fs");
const cheerio = require("cheerio");

async function scarica(url) {
    const res = await fetch(url);
    return await res.text();
}

async function main() {

    const html = await scarica(
        "https://fipavonline.it/main/tutti_i_campionati"
    );

    const $ = cheerio.load(html);

    const gironi = [];

    $("a").each((i, el) => {

        const href = $(el).attr("href") || "";

        if (href.includes("gare_girone")) {

            const match =
                href.match(/gare_girone\/(\d+)/);

            if (!match) return;

            const id = match[1];

            gironi.push({
                id,
                url: href.startsWith("http")
                    ? href
                    : `https://fipavonline.it${href}`
            });
        }
    });

    const risultato = [];

    for (const g of gironi) {

        try {

            const pagina =
                await scarica(g.url);

            const $$ =
                cheerio.load(pagina);

            const titolo =
                $("h1").first().text().trim() ||
                $("title").text().trim();

            risultato.push({
                nome: titolo,
                girone: g.id,
                url: g.url
            });

        } catch (err) {

            console.log(
                "Errore girone",
                g.id
            );
        }
    }

    fs.mkdirSync(
        "data",
        { recursive: true }
    );

    fs.writeFileSync(
        "data/gironi.json",
        JSON.stringify(
            {
                aggiornamento:
                    new Date().toISOString(),
                gironi: risultato
            },
            null,
            2
        )
    );

    console.log(
        `Trovati ${risultato.length} gironi`
    );
}

main();
