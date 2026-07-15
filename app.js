alert("APP JS CARICATO");

window.onload = function() {

  document.getElementById("lastUpdate").innerHTML =
    "🕒 Ultimo aggiornamento: " +
    new Date().toLocaleString("it-IT");

  document.getElementById("app").innerHTML = `

    <button onclick="alert('Under 12 cliccato')">
      Under 12 Femminile
    </button>

    <br><br>

    <button onclick="alert('Under 13 cliccato')">
      Under 13 Femminile
    </button>

  `;
};
