async function apriCampionato(nome) {

  const response =
    await fetch("data/gironi.json");

  const dati =
    await response.json();

  const girone =
    dati.gironi.find(g => g.nome === nome);

  if (!girone) {

    document.getElementById("app").innerHTML =
      "<p>Campionato non trovato</p>";

    return;
  }

  const url = girone.url;

  document.getElementById("app").innerHTML = `

    <button onclick="caricaHome()">
      ⬅ Torna
    </button>

    <div class="card">

      <h2>${girone.nome}</h2>

      <p>
        👥 Squadre: ${girone.squadre.length}
      </p>

      <p>
        ${url}
          🌐 Apri dati ufficiali FIPAV
        </a>
      </p>

    </div>

  `;
}
