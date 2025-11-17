import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR REAL FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyA_XtJyPUit-yA66BzOdSI_Mr_UX2Zxd7U",
  authDomain: "chaipos-b19bb.firebaseapp.com",
  projectId: "chaipos-b19bb",
  storageBucket: "chaipos-b19bb.firebasestorage.app",
  messagingSenderId: "1010675629996",
  appId: "1:1010675629996:web:2325050a8c64d0ff754409",
  measurementId: "G-EZGYYNE6W1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to separate data for different tenants/users
export const APP_ID = "chai_pos_v1";