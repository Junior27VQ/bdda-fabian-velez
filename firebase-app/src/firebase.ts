import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9aljyAut0meclCdo0tMS18Fd5TQueJP4",
  authDomain: "biblioteca-digital-36992.firebaseapp.com",
  projectId: "biblioteca-digital-36992",
  storageBucket: "biblioteca-digital-36992.firebasestorage.app",
  messagingSenderId: "484315706841",
  appId: "1:484315706841:web:efe352407e79e92c5295c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
