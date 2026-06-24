// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaGUEDAS6Q_lRu3r1FZ-_NTF5hl1eoROw",
  authDomain: "goikorol.firebaseapp.com",
  projectId: "goikorol",
  storageBucket: "goikorol.firebasestorage.app",
  messagingSenderId: "524799531120",
  appId: "1:524799531120:web:002688b10f2491f5ccbcb5",
  measurementId: "G-RX6J13245F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
