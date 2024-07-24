import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRFCLZvhmRX0uvfByE0vOYlq1ylZsLdOY",
  authDomain: "pesto-todolist-react.firebaseapp.com",
  projectId: "pesto-todolist-react",
  storageBucket: "pesto-todolist-react.appspot.com",
  messagingSenderId: "37637388717",
  appId: "1:37637388717:web:36e5a5112ccdc18e7d8924",
  measurementId: "G-FL4DMKF3D4",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };
