import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Primary Firebase (Talkies & Achievements Portal)
const app = getApps().find((a) => a.name === "[DEFAULT]") || initializeApp(firebaseConfig);

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Legacy Agomoni App Support
let agomoniDb = db;
try {
  const agomoniConfig = {
    apiKey: process.env.AGOMONI_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.AGOMONI_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.AGOMONI_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.AGOMONI_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.AGOMONI_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.AGOMONI_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.AGOMONI_FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
  const agomoniApp = getApps().find((a) => a.name === "agomoni") || initializeApp(agomoniConfig, "agomoni");
  agomoniDb = getFirestore(agomoniApp);
} catch {
  agomoniDb = db;
}

export { app, db, storage, agomoniDb };
