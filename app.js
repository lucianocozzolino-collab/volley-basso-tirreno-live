let datiGlobali = null;

async function caricaHome() {

  const response =
    await fetch("data/gironi.json");

  datiGlobali =
    await response.json();

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Aggiornamento: " +
    datiGlobali.aggiornamento;

  document.getElementById("app").innerHTML = `

    <div class="card">

      <h2>🏐 Ricerca Campionato</h2>

      <p>📅 Anno</p>

      <select id="anno" onchange="aggiornaCampionati()">
        <option value="2025-2026">
          2025-2026
        </option>
      </select>

      <p>🏆 Campionato</p>

      <select id="campionato" onchange="aggiornaGironi()">
      </select>

      <p>📂 Girone</p>

      <select id="girone" onchange="aggiornaSquadre()">
      </select>

      <p>👕 Squadra</p>

      <select id="squadra" onchange="visualizzaSquadra()">
      </select>

    </div>

    <div id="risultati"></div>

  `;

  aggiornaCampionati();

}

function aggiornaCampionati() {

  const campionati = [

    ...new Set(

      datiGlobali.gironi.map(g =>

        g.nome.replace(
          /\s*-\s*Girone\s+[A-Z0-9]+.*/,
          ""
        ).trim()

      )

    )

  ];

  const select =
    document.getElementById("campionato");

  select.innerHTML = "";

  campionati.forEach(c => {

    select.innerHTML += `
      <option value="${c}">
        ${c}
      </option>
    `;

  });

  aggiornaGironi();

}

function aggiornaGironi() {

  const campionato =
    document.getElementById("campionato").value;

  const select =
    document.getElementById("girone");

  select.innerHTML = "";

  datiGlobali.gironi

    .filter(g =>
      g.nome.startsWith(campionato)
    )

    .forEach(g => {

      let nomeGirone = "Girone";

      const match =
        g.nome.match(/Girone\s+[A-Z0-9]+/i);

      if (match) {

        nomeGirone = match[0];

      }

      select.innerHTML += `
        <option value="${g.id}">
          ${nomeGirone}
        </option>
      `;

    });

  aggiornaSquadre();

}

function aggiornaSquadre() {

  const id =
    parseInt(
      document.getElementById("girone").value
    );

  const select =
    document.getElementById("squadra");

  select.innerHTML = "";

  const girone =
    datiGlobali.gironi.find(
      g => g.id === id
    );

  if (!girone) return;

  girone.squadre.forEach(s => {

    select.innerHTML += `
      <option value="${s}">
        ${s}
      </option>
    `;

  });

  visualizzaSquadra();

}

function visualizzaSquadra() {

  const id =
    parseInt(
      document.getElementById("girone").value
    );

  const squadra =
    document.getElementById("squadra").value;

  const girone =
    datiGlobali.gironi.find(
      g => g.id === id
    );

  if (!girone || !squadra) return;

  const gare =

    girone.calendario.filter(g =>

      g.casa === squadra ||
      g.ospite === squadra

    );

  let html = `

    <div class="card">

      <h2>🏐 ${squadra}</h2>

      <p>
        ${girone.nome}
      </p>

      <p>

        ${girone.url}

          🌐 Apri FIPAV

        </a>

      </p>

    </div>

    <h3>📅 Calendario</h3>

  `;

  gare.forEach(g => {

    html += `

      <div class="card">

        <strong>${g.gara}</strong>

        <br><br>

        📅 ${g.data}

        <br><br>

        🏠 ${g.casa}

        <br>

        🆚

        <br>

        🚍 ${g.ospite}

        <br><br>

        ✅ ${g.risultato}

      </div>

    `;

  });

  document.getElementById("risultati").innerHTML =
    html;

}

window.onload = caricaHome;
