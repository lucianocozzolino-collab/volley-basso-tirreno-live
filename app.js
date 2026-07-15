const stagioni = [
  "2026/2027",
  "2025/2026",
  "2024/2025",
  "2023/2024"
];

let stagioneSelezionata = "2025/2026";

const campionati = [
  "Under 12 Femminile",
  "Under 13 Femminile",
  "Under 14 Femminile",
  "Under 16 Femminile",
  "Under 18 Femminile",
  "Serie D",
  "Volley S3"
];

caricaHome();

function caricaHome() {

    let html = `

        <div class="card">

            <button onclick="aggiornaDati()">
                🔄 Aggiorna Ora
            </button>

            <h3>📅 Stagione</h3>

            <select
                id="stagione"
                onchange="cambiaStagione()">

                ${stagioni.map(s => `
                    <option
                        value="${s}"
                        ${s === stagioneSelezionata ? "selected" : ""}>
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
            <button onclick="apriCampionato('${c}')">
                ${c}
            </button><br>
        `;
    });

    html += `</div>`;

    document.getElementById("app").innerHTML = html;
}

function cambiaStagione() {

    stagioneSelezionata =
        document.getElementById("stagione").value;

    document.getElementById("lastUpdate").innerHTML =
        "📅 Stagione selezionata: " +
        stagioneSelezionata;
}

function apriCampionato(nome){

    document.getElementById("app").innerHTML = `

        <button onclick="caricaHome()">
            ⬅ Torna ai campionati
        </button>

        <div class="card">

            <h2>${nome}</h2>

            <p>
              📅 Stagione:
              <strong>${stagioneSelezionata}</strong>
            </p>

            <h3>📊 Classifica</h3>
            <p>Dati FIPAV in caricamento...</p>

            <h3>🏆 Risultati</h3>
            <p>Dati FIPAV in caricamento...</p>

            <h3>📅 Calendario</h3>
            <p>Dati FIPAV in caricamento...</p>

            <h3>👥 Squadre</h3>
            <p>Dati FIPAV in caricamento...</p>

        </div>
    `;
}

function aggiornaDati() {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Aggiornato: " +
        new Date().toLocaleString("it-IT");

    location.reload();
}

fetch("data/status.json")
.then(r => r.json())
.then(data => {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Ultimo aggiornamento: " +
        data.ultimoAggiornamento;

})
.catch(() => {

    document.getElementById("lastUpdate").innerHTML =
        "🕒 Ultimo aggiornamento non disponibile";

});
