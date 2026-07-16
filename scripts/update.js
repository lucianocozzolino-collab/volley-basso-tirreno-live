const axios = require("axios");
const fs = require("fs");

async function main() {

    const response = await axios.get(
        "https://fipavonline.it/main/gare_girone/59764",
        {
            maxRedirects: 20,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        }
    );

    fs.mkdirSync("data", {
        recursive: true
    });

    fs.writeFileSync(
        "data/girone-59764.html",
        response.data
    );

    console.log("HTML salvato");
}

main();
