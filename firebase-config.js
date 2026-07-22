import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDu8c2RvKIre4MsYyTQI8cm2md26Puf2RQ",
    authDomain: "healthsync-demo-2be71.firebaseapp.com",
    projectId: "healthsync-demo-2be71",
    storageBucket: "healthsync-demo-2be71.firebasestorage.app",
    messagingSenderId: "207870052713",
    appId: "1:207870052713:web:d0c4fe26751a3136d195f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
