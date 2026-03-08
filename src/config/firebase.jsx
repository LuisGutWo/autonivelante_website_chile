// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// 🔐 Firebase configuration usando variables de entorno seguras
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    process.env.NEXT_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validar que las variables de entorno estén configuradas
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket
) {
  console.warn(
    "⚠️ Las variables de entorno de Firebase no están completamente configuradas. " +
      "Asegúrate de que .env.local está configurado correctamente.",
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
