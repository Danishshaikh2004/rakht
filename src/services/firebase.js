// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCBJXa9nM1bTdY9EDVnV5UZABxoqNeFfoE",
  authDomain: "bloodlink-f9273.firebaseapp.com",
  projectId: "bloodlink-f9273",
  storageBucket: "bloodlink-f9273.firebasestorage.app",
  messagingSenderId: "589993429468",
  appId: "1:589993429468:web:014a41ed1bc3384e4ca719",
  measurementId: "G-2LMYMKNH45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
