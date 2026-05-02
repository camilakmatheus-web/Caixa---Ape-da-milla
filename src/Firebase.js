import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBB98wKroLAtEy1BSYjuUWMh0yTCeZIBUs",
  authDomain: "sistema-caixa-c0c34.firebaseapp.com",
  projectId: "sistema-caixa-c0c34",
  storageBucket: "sistema-caixa-c0c34.firebasestorage.app",
  messagingSenderId: "658833154874",
  appId: "1:658833154874:web:e86c1d400b258231e5e603"
};

// inicializa app
const app = initializeApp(firebaseConfig);

// auth do firebase
export const auth = getAuth(app);

// provider do Google
export const provider = new GoogleAuthProvider();