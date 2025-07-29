// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVF-0nIEzFF78zCRVEjk0TEUxImxzEVnc",
  authDomain: "dua-garments.firebaseapp.com",
  projectId: "dua-garments",
  storageBucket: "dua-garments.appspot.com",
  messagingSenderId: "667789973517",
  appId: "1:667789973517:web:c432db4df212e6171f1d44",
  measurementId: "G-ZE6SGHJKSV"
};

export default firebaseConfig;

// Optionally, you can still initialize and export storage/db here if needed elsewhere
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
// export const db = getFirestore(app);