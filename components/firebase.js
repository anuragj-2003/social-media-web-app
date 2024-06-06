import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCe4YOeQo4MtnZCsdmJp-avYT5Ff7K2y70",
  authDomain: "coderschuck.firebaseapp.com",
  projectId: "coderschuck",
  storageBucket: "coderschuck.appspot.com",
  messagingSenderId: "644149136475",
  appId: "1:644149136475:web:cc573000872ae15739437e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };