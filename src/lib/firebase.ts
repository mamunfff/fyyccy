import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://movie-5345b-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "movie-5345b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only initialize if we have a potentially valid API key
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here';

let app;
try {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn('Firebase API Key is missing or placeholder. Firebase features will be limited.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getDatabase(app) : null;
