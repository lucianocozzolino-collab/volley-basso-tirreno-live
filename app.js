function caricaHome() {

    let html = `

        <div class="card">

            <button onclick="aggiornaDati()">
                🔄 Aggiorna Ora
            </button>

            <h2>🏐 Campionati</h2>

            <button onclick="apriCampionato('Under 12 Femminile')">
                Under 12 Femminile
            </button><br><br>

            <button onclick="apriCampionato('Under 13 Femminile')">
                Under 13 Femminile
            </button><br><br>

            <button onclick="apriCampionato('Under 14 Femminile')">
                Under 14 Femminile
            </button><br><br>

            <button onclick="apriCampionato('Under 16 Femminile')">
                Under 16 Femminile
            </button><br><br>

            <button onclick="apriCampionato('Under 18 Femminile')">
                Under 18 Femminile
            </button><br><br>

            <button onclick="apriCampionato('Serie D')">
                Serie D
            </button><br><br>

            <button onclick="apriCampionato('Volley S3')">
                Volley S3
            </button>

        </div>

    `;

    document.getElementById("app").innerHTML = html;
}

function apriCampionato(nome) {

    document.getElementById("app").innerHTML = `

        <button onclick="caricaHome()">
            ⬅ Torna ai campionati
        </button>

        <div class="card">

            <h2>${nome}</h2>

            <h3>📊 Classifica</h3>
            <p>Classifica in caricamento...</p>

            <h3>🏆 Risultati</h3>
            <p>Risultati in caricamento...</p>

            <h3>📅 Calendario</h3>
            <p>Calendario in caricamento...</p>

        </div>

    `;
}

function aggiornaDati() {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Aggiornato: " +
        new Date().toLocaleString("it-IT");
}

window.onload = function () {

    const lastUpdate =
        document.getElementById("lastUpdate");

    if (lastUpdate) {

        lastUpdate.innerHTML =
            "🕒 Ultimo aggiornamento: " +
            new Date().toLocaleString("it-IT");
    }

    caricaHome();
};
