import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Replace these placeholder values with your actual Firebase configuration.
const __firebase_config = JSON.stringify({
  apiKey: "AIzaSyBWrPuy2fFmWuKaYzaHp9VHYgNofSz6k1g",
  authDomain: "swiftbill-wyzkx.firebaseapp.com",
  projectId: "swiftbill-wyzkx",
  storageBucket: "swiftbill-wyzkx.firebasestorage.app",
  messagingSenderId: "739805008553",
  appId: "1:739805008553:web:c7250fce45447d788b0fb8"
});

// This is a placeholder for the app ID, which you can replace.
const __app_id = 'default-app-id';

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
export const appId = rawAppId.replace(/\//g, '_');

export { auth, db, functions };

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Offline persistence not supported');
  }
});

// This is a placeholder for a custom auth token, if you use one.
export const __initial_auth_token = '';
