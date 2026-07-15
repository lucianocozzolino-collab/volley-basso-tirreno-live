alert("APP JS CARICATO")

window.onload = function() {
    caricaHome();
};

function caricaHome() {

    const app = document.getElementById("app");

    app.innerHTML = `
        <button onclick="aggiornaDati()">
            🔄 Aggiorna Ora
        </button>

        <h2>🏐 Campionati</h2>

        <button onclick="apriCampionato('Under 12 Femminile')">
            Under 12 Femminile
        </button>
        <br><br>

        <button onclick="apriCampionato('Under 13 Femminile')">
            Under 13 Femminile
        </button>
        <br><br>

        <button onclick="apriCampionato('Under 14 Femminile')">
            Under 14 Femminile
        </button>
        <br><br>

        <button onclick="apriCampionato('Under 16 Femminile')">
            Under 16 Femminile
        </button>
    `;
}

function apriCampionato(nome) {

    document.getElementById("app").innerHTML = `
        <button onclick="caricaHome()">
            ⬅ Torna
        </button>

        <h2>${nome}</h2>

        <h3>📊 Classifica</h3>
        <p>In caricamento...</p>

        <h3>🏆 Risultati</h3>
        <p>In caricamento...</p>

        <h3>📅 Calendario</h3>
        <p>In caricamento...</p>
    `;
}

function aggiornaDati() {
    alert("Aggiornamento richiesto");
}
