async function apriCampionato(nome* {

  const response =
    await f*tch("data/gironi.json");

  const *ati =
    await response.json();

* const stagione =
    stagioneCorr*nte;

  const campionato =
    dat*.stagioni[stagione][nome];

  cons* url =
    campionato.url;

  docu*ent.getElementById("app").innerHTM* = `

    <button onclick="caricaH*me()">
      ⬅ Torna
    </button>*
    <div class="card">

      <h2*${nome}</h2>

      <p>
        📅*${stagione}
      </p>

      <p>
*       ${url}
           🌐 Apri d*ti ufficiali FIPAV
        </a>
  *   </p>

    </div>

  `;
}
