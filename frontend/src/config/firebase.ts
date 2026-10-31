import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAmuSuEqKOAL4DZazuK4S2Znmj6N7aOjfk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sunraise-solutions.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sunraise-solutions",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sunraise-solutions.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "679901237851",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:679901237851:web:e27ec9cd9779a3f727257e"
};

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export default app;
