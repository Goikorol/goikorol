// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaGUEDAS6Q_lRu3r1FZ-_NTF5hl1eoROw",
  authDomain: "goikorol.firebaseapp.com",
  projectId: "goikorol",
  storageBucket: "goikorol.firebasestorage.app",
  messagingSenderId: "524799531120",
  appId: "1:524799531120:web:002688b10f2491f5ccbcb5"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
