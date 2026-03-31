// Firebase libraries import කරගැනීම
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "guidedlearn-bf639",
  storageBucket: "guidedlearn-bf639.firebasestorage.app",
  messagingSenderId: "12553481897",
  appId: "1:12553481897:web:cb179fd2df311940b2c3b8",
  measurementId: "G-L6ZW59TSGL"
};

// Firebase initialize කිරීම
const app = initializeApp(firebaseConfig);

// අපිට පස්සේ පාවිච්චි කරන්න ඕනේ වෙන කොටස් Export කරනවා
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
