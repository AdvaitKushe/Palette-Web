// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import secrets from './secrets.json';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: secrets.firebase.apiKey,
  authDomain: secrets.firebase.authDomain,
  databaseURL: secrets.firebase.databaseURL,
  projectId: secrets.firebase.projectId,
  storageBucket: secrets.firebase.storageBucket,
  messagingSenderId: secrets.firebase.messagingSenderId,
  appId: secrets.firebase.appId,
  measurementId: secrets.firebase.measurementId
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const realtimeDb = getDatabase(app);

