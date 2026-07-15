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

function apriCampionato(nome){

 fetch("data/campionati.json")
 .then(r => r.json())
 .then(data => {

    const campionato = data[nome];

    let classifica = "";

    if(campionato){

      campionato.classifica.forEach(s => {

        classifica += `
          <p>
            ${s.squadra} - ${s.punti} punti
          </p>
        `;

      });

    }

    document.getElementById("app").innerHTML = `

      <button onclick="caricaHome()">
        ⬅ Torna ai campionati
      </button>

      <div class="card">

        <h2>${nome}</h2>

        <h3>📊 Classifica</h3>

        ${classifica}

      </div>

    `;

 });

}


function aggiornaDati() {

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Aggiornamento eseguito: " +
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
