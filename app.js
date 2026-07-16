let datiGlobali = null;

async function caricaHome() {

  const response =
    await fetch("data/gironi.json");

  datiGlobali =
    await response.json();

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Aggiornamento: " +
    datiGlobali.aggiornamento;

  let html = `

    <div class="card">

      <h2>🏐 Ricerca Campionato</h2>

      <p>📅 Anno</p>

      <select id="anno" onchange="aggiornaCampionati()">
        <option value="2025-2026">
          2025-2026
        </option>
      </select>

      <p>🏆 Campionato</p>

      <select id="campionato"
              onchange="aggiornaGironi()">

        <option value="">
          Seleziona
        </option>

      </select>

      <p>📂 Girone</p>

      <select id="girone"
              onchange="aggiornaSquadre()">

        <option value="">
          Seleziona
        </option>

      </select>

      <p>👕 Squadra</p>

      <select id="squadra"
              onchange="visualizzaSquadra()">

        <option value="">
          Seleziona
        </option>

      </select>

    </div>

    <div id="risultati"></div>

  `;

  document.getElementById("app").innerHTML = html;

  aggiornaCampionati();

}

function aggiornaCampionati() {

  const campionati =
    [...new Set(
      datiGlobali.gironi.map(g =>
        g.nome.split(" - Girone")[0].trim()
      )
    )];

  const select =
    document.getElementById("campionato");

  select.innerHTML =
    '<option value="">Seleziona</option>';

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

  select.innerHTML =
    '<option value="">Seleziona</option>';

  datiGlobali.gironi
    .filter(g =>
      g.nome.includes(campionato)
    )
    .forEach(g => {

      select.innerHTML += `
        <option value="${g.id}">
          ${g.nome}
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

  select.innerHTML =
    '<option value="">Seleziona</option>';

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

}

function visualizzaSquadra() {

  const id =
    parseInt(
      document.getElementById("girone").value
    );

  const squadra =
    document.getElementById("squadra").value;

  if (!squadra) return;

  const girone =
    datiGlobali.gironi.find(
      g => g.id === id
    );

  if (!girone) return;

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

        <b>${g.gara}</b>

        <br>

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
