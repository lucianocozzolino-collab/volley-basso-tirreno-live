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

      <select id="anno"
              onchange="aggiornaCampionati()">
      </select>

      <p>🏆 Campionato</p>

      <select id="campionato"
              onchange="aggiornaGironi()">
      </select>

      <p>📂 Girone</p>

      <select id="girone"
              onchange="aggiornaSquadre()">
      </select>

      <p>👕 Squadra</p>

      <select id="squadra"
              onchange="visualizzaSquadra()">
      </select>

    </div>

    <div id="risultati"></div>

  `;

  caricaAnni();

}

function caricaAnni() {

  const anni = [

    ...new Set(

      datiGlobali.gironi.map(
        g => g.stagione
      )

    )

  ].sort();

  const select =
    document.getElementById("anno");

  select.innerHTML = "";

  anni.forEach(anno => {

    select.innerHTML += `
      <option value="${anno}">
        ${anno}
      </option>
    `;

  });

  aggiornaCampionati();

}

function aggiornaCampionati() {

  const anno =
    document.getElementById("anno").value;

  const campionati = [

    ...new Set(

      datiGlobali.gironi

        .filter(
          g => g.stagione === anno
        )

        .map(
          g => g.campionato
        )

    )

  ].sort();

  const select =
    document.getElementById("campionato");

  select.innerHTML = "";

  campionati.forEach(campionato => {

    select.innerHTML += `
      <option value="${campionato}">
        ${campionato}
      </option>
    `;

  });

  aggiornaGironi();

}

function aggiornaGironi() {

  const anno =
    document.getElementById("anno").value;

  const campionato =
    document.getElementById("campionato").value;

  const select =
    document.getElementById("girone");

  select.innerHTML = "";

  datiGlobali.gironi

    .filter(g =>

      g.stagione === anno &&
      g.campionato === campionato

    )

    .sort((a, b) =>
      a.girone.localeCompare(b.girone)
    )

    .forEach(g => {

      select.innerHTML += `
        <option value="${g.id}">
          ${g.girone}
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

  girone.squadre
    .sort()
    .forEach(squadra => {

      select.innerHTML += `
        <option value="${squadra}">
          ${squadra}
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

  if (!girone || !squadra) {
    return;
  }

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
