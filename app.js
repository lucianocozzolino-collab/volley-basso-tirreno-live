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

        <button onclick="apriGirone(${girone.id})">
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

async function apriGirone(id) {

  const response =
    await fetch("data/gironi.json");

  const dati =
    await response.json();

  const girone =
    dati.gironi.find(
      g => g.id === id
    );

  if (!girone) return;

  let html = `

    <button onclick="caricaHome()">
      ⬅ Home
    </button>

    <div class="card">

      <h2>${girone.nome}</h2>

      <p>

        ${girone.url}

          🌐 Apri su FIPAV

        </a>

      </p>

      <h3>👕 Seleziona squadra</h3>

  `;

  girone.squadre.forEach(squadra => {

    html += `

      <button
        style="margin:5px"
        onclick="
          apriSquadra(
            ${id},
            '${squadra.replace(/'/g, "\\'")}'
          )
        ">

        ${squadra}

      </button>

    `;

  });

  html += `
    </div>
  `;

  document.getElementById("app").innerHTML =
    html;

}

async function apriSquadra(idGirone, nomeSquadra) {

  const response =
    await fetch("data/gironi.json");

  const dati =
    await response.json();

  const girone =
    dati.gironi.find(
      g => g.id === idGirone
    );

  if (!girone) return;

  const gare =
    girone.calendario.filter(g =>

      g.casa === nomeSquadra ||
      g.ospite === nomeSquadra

    );

  let html = `

    <button onclick="apriGirone(${idGirone})">
      ⬅ Girone
    </button>

    <div class="card">

      <h2>🏐 ${nomeSquadra}</h2>

      <p>
        Girone:
        ${girone.nome}
      </p>

    </div>

    <h3>📅 Calendario</h3>

  `;

  gare.forEach(gara => {

    html += `

      <div class="card">

        <b>${gara.gara}</b>

        <br>

        📅 ${gara.data}

        <br><br>

        🏠 ${gara.casa}

        <br>

        🆚

        <br>

        🚍 ${gara.ospite}

        <br><br>

        ✅ ${gara.risultato}

      </div>

    `;

  });

  document.getElementById("app").innerHTML =
    html;

}

window.onload = caricaHome;
