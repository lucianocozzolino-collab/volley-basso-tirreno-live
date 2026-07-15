window.onload = function () {

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Ultimo aggiornamento: " +
    new Date().toLocaleString("it-IT");

  caricaHome();
};

function caricaHome() {

  document.getElementById("app").innerHTML = `

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

  `;
}

function apriCampionato(nome) {

  document.getElementById("app").innerHTML = `

    <button onclick="caricaHome()">
      ⬅ Torna
    </button>

    <div class="card">

      <h2>${nome}</h2>

      <h3>📊 Classifica</h3>
      <p>In caricamento...</p>

      <h3>🏆 Risultati</h3>
      <p>In caricamento...</p>

      <h3>📅 Calendario</h3>
      <p>In caricamento...</p>

      <p>
        avonline.it/main/gare_girone/53943/1"
           target="_blank">
           🌐 Apri pagina FIPAV
        </a>
      </p>

    </div>
  `;
}

function aggiornaDati() {
  location.reload();
}
