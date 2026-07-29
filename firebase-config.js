// Sostituisci questi valori con quelli del TUO progetto Firebase
// (Console Firebase → ⚙️ Project settings → Le tue app → configurazione SDK)
// Questi valori sono pubblici per design: la protezione vera è nelle regole di Firestore.

const firebaseConfig = {
  apiKey: "INCOLLA_QUI_LA_TUA_API_KEY",
  authDomain: "tuo-progetto.firebaseapp.com",
  projectId: "tuo-progetto",
  storageBucket: "tuo-progetto.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
};

firebase.initializeApp(firebaseConfig);
