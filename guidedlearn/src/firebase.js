// Firebase libraries import කරගැනීම
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "g-learn-cdc71",
  storageBucket: "g-learn-cdc71.firebasestorage.app",
  messagingSenderId: "683087394494",
  appId: "1:683087394494:web:2b9ce7488ea93bd047d0ef",
  measurementId: "G-230H57LR6T"
};


const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
