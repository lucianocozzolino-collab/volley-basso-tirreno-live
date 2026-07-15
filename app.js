window.onload = function () {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Ultimo aggiornamento: " +
        new Date().toLocaleString("it-IT");

    caricaHome();
};

const stagioni = [
    "2026/2027",
    "2025/2026",
    "2024/2025",
    "2023/2024"
];

let stagioneCorrente = "2025/2026";

const campionati = [
    "Under 12 Femminile",
    "Under 13 Femminile",
    "Under 14 Femminile",
    "Under 16 Femminile",
    "Under 18 Femminile",
    "Prima Divisione",
    "Seconda Divisione",
    "Serie D",
    "Volley S3 3x3 Femminile",
    "Volley S3 3x3 Maschile",
    "Volley S3 3x3 Misto",
    "Volley S3 2x2 Femminile",
    "Volley S3 2x2 Maschile",
    "Volley S3 2x2 Misto"
];

function caricaHome() {

    let html = `

    <div class="card">

        <button onclick="aggiornaDati()">
            🔄 Aggiorna Ora
        </button>

        <br><br>

        <label><strong>📅 Stagione</strong></label>

        <br><br>

        <select id="stagione" onchange="cambiaStagione()">

            ${stagioni.map(s => `
                <option
                    value="${s}"
                    ${s === stagioneCorrente ? "selected" : ""}>
                    ${s}
                </option>
            `).join("")}

        </select>

    </div>

    <div class="card">

        <h2>🏐 Campionati</h2>
    `;

    campionati.forEach(c => {

        html += `
            <button
                onclick="apriCampionato('${c}')">
                ${c}
            </button>

            <br><br>
        `;
    });

    html += `</div>`;

    document.getElementById("app").innerHTML = html;
}

function cambiaStagione() {

    stagioneCorrente =
        document.getElementById("stagione").value;

    document.getElementById("lastUpdate").innerHTML =
        "📅 Stagione selezionata: " +
        stagioneCorrente;
}

function apriCampionato(nome) {

    document.getElementById("app").innerHTML = `

        <button onclick="caricaHome()">
            ⬅ Torna ai campionati
        </button>

        <div class="card">

            <h2>${nome}</h2>

            <p>
                📅 Stagione:
                <strong>${stagioneCorrente}</strong>
            </p>

            <p>
                🌐 <a
                href="https://fipavonline.it/main/gare_girone/53943/1"
                target="_blank">
                Apri dati ufficiali FIPAV
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

}
