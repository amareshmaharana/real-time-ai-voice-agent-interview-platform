import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // firebase api key
  authDomain: "vinterra-700f9.firebaseapp.com",
  projectId: "vinterra-700f9",
  storageBucket: "vinterra-700f9.firebasestorage.app",
  messagingSenderId: "933286910544",
  appId: "1:933286910544:web:8f7243d4eea2765ee44f55",
  measurementId: "G-R8EY2WY48K",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);