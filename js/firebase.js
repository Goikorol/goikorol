// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "goikorol.firebaseapp.com",
    databaseURL: "TU_DATABASE_URL",
    projectId: "goikorol",
    storageBucket: "goikorol.firebasestorage.app",
    messagingSenderId: "524799531120",
    appId: "TU_APP_ID",
    measurementId: "G-RX6J13245F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
