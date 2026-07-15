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
    <button onclick="aggiornaDati()">
      🔄 Aggiorna Ora
    </button>

    <h2>🏐 Campionati</h2>
  `;

  campionati.forEach(c => {
    html += `
      <button onclick="apriCampionato('${c}')">
        ${c}
      </button>
      <br>
    `;
  });

  document.getElementById("app").innerHTML = html;
}

function apriCampionato(nome){

  document.getElementById("app").innerHTML = `
    <button onclick="caricaHome()">
      ⬅ Torna ai campionati
    </button>

    <div class="card">

      <h2>${nome}</h2>

      <h3>📊 Classifica</h3>
      <p>Dati in arrivo da FIPAV...</p>

      <h3>🏆 Risultati</h3>
      <p>Dati in arrivo da FIPAV...</p>

      <h3>📅 Calendario</h3>
      <p>Dati in arrivo da FIPAV...</p>

    </div>
  `;
}

function aggiornaDati() {
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
  "🕒 Aggiornamento non disponibile";
});
