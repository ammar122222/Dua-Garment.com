import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Persistent login
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Admin will stay logged in after refresh."))
  .catch((error) => console.error("❌ Persistence error:", error));

// Check user state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Logged-in UID:", user.uid);
  } else {
    console.log("❌ No user is logged in.");
  }
});
