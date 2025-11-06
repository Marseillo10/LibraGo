import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC3TJLtIfEZdtNuTivD6N5x-ZH-Ez7wiIg",
  authDomain: "librago-1010.firebaseapp.com",
  projectId: "librago-1010",
  storageBucket: "librago-1010.firebasestorage.app",
  messagingSenderId: "30521787949",
  appId: "1:30521787949:web:01aa27bb67937024d3daa4",
  measurementId: "G-L4HQZEELHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);