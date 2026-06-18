import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDMQvO0LELeIqgiA-6vKfXoi1HufM1qqEc",
    authDomain: "tlchome.firebaseapp.com",
    projectId: "tlchome",
    storageBucket: "tlchome.firebasestorage.app",
    messagingSenderId: "671053314018",
    appId: "1:671053314018:web:0d3772f823c286c335ebbb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
