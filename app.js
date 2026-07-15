const campionati = [
  "Under 12 Femminile",
  "Under 13 Femminile",
  "Under 14 Femminile",
  "Under 16 Femminile",
  "Under 18 Femminile",
  "Serie D",
  "Volley S3"
];

let html = "<h2>🏐 Campionati</h2>";

campionati.forEach(c => {
  html += `
    <button onclick="apriCampionato('${c}')">
      ${c}
    </button><br><br>
  `;
});

document.getElementById("app").innerHTML = html;

function apriCampionato(nome) {

  document.getElementById("app").innerHTML = `
    <h2>${nome}</h2>

    <button onclick="location.reload()">
      ⬅ Torna ai campionati
    </button>

    <h3>📊 Classifica</h3>

    <p>Dati in arrivo da FIPAV...</p>

    <h3>🏆 Risultati</h3>

    <p>Dati in arrivo da FIPAV...</p>

    <h3>📅 Calendario</h3>

    <p>Dati in arrivo da FIPAV...</p>
  `;
}
