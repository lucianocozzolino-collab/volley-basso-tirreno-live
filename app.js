window.onload = function () {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Ultimo aggiornamento: " +
        new Date().toLocaleString("it-IT");

    caricaHome();
};

function caricaHome() {

    document.getElementById("app").innerHTML = `

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
}

function apriCampionato(nome) {

    let linkFipav = "";

    if (nome === "Under 12 Femminile") {
        linkFipav = "https://fipavonline.it/main/gare_girone/53943/1";
    }

    document.getElementById("app").innerHTML = `

        <button onclick="caricaHome()">
            ⬅ Torna
        </button>

        <div class="card">

            <h2>${nome}</h2>

            <p>
                📅 Stagione 2025/2026
            </p>

            <p>
                linkFipav}" target="_blank">
                    🌐 Apri pagina ufficiale FIPAV
                </a>
            </p>

            <h3>📊 Classifica</h3>
            <p>In caricamento...</p>

            <h3>🏆 Risultati</h3>
            <p>In caricamento...</p>

            <h3>📅 Calendario</h3>
            <p>In caricamento...</p>

            <h3>👥 Squadre</h3>
            <p>In caricamento...</p>

        </div>

    `;
}

function aggiornaDati() {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Aggiornato: " +
        new Date().toLocaleString("it-IT");

    alert("Aggiornamento completato");

}
