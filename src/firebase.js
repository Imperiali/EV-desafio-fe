import { initializeApp } from 'firebase';

const app = initializeApp({
  apiKey: "AIzaSyBBNWfzEF-nFHqxLUYefWaBC96JPo3L5pQ",
  authDomain: "ev-desafio-fe.firebaseapp.com",
  databaseURL: "https://ev-desafio-fe.firebaseio.com/",
  projectId: "ev-desafio-fe",
  storageBucket: "ev-desafio-fe.appspot.com",
  messagingSenderId: "37547990089"
});

export const db = app.database();
export const enderecoRef = db.ref('enderecos');
