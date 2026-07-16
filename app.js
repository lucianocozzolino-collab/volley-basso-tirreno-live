async function caricaHome() {

  const response =
    await fetch("data/gironi.json");

  const dati =
    await response.json();

  let html =
    "<h2>🏐 Campionati disponibili</h2>";

  dati.gironi.forEach(girone => {

    html += `

      <div class="card">

        <h3>${girone.nome}</h3>

        <p>
          👥 ${girone.squadre.length} squadre
        </p>

        <button onclick="apriCampionato('${girone.nome}')">
          Apri
        </button>

      </div>

    `;

  });

  document.getElementById("app").innerHTML =
    html;

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Aggiornamento: " +
    dati.aggiornamento;

}

async function apriCampionato(nome) {

  const response =
    await fetch("data/gironi.json");

  const dati =
    await response.json();

  const girone =
    dati.gironi.find(
      g => g.nome === nome
    );

  if (!girone) {

    document.getElementById("app").innerHTML =
      "<p>Campionato non trovato</p>";

    return;

  }

  let html = `

    <button onclick="caricaHome()">
      ⬅ Torna
    </button>

    <div class="card">

      <h2>${girone.nome}</h2>

      <p>
        👥 ${girone.squadre.length} squadre
      </p>

      <p>
        ${girone.url}="_blank">
          🌐 Apri dati ufficiali FIPAV
        </a>
      </p>

      <h3>Squadre</h3>

      <ul>

  `;

  girone.squadre.forEach(squadra => {

    html += `
      <li>${squadra}</li>
    `;

  });

  html += `
      </ul>

      <h3>Calendario</h3>
  `;

  girone.calendario.forEach(gara => {

    html += `

      <div class="card">

        <b>${gara.gara}</b><br>

        📅 ${gara.data}<br>

        🏐 ${gara.casa}<br>

        🆚 ${gara.ospite}<br>

        ✅ ${gara.risultato}

      </div>

    `;

  });

  document.getElementById("app").innerHTML =
    html;

}

window.onload = caricaHome;
