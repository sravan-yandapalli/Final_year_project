import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnhboti6lP9ocNloVuiQh1V5kpgn3nW-8",
  authDomain: "insta-clone-bcd19.firebaseapp.com",
  projectId: "insta-clone-bcd19",
  storageBucket: "insta-clone-bcd19.appspot.com",
  messagingSenderId: "135005660211",
  appId: "1:135005660211:web:46f96bd1c8cfb5445eaf46",
  measurementId: "G-3YKNPPELDF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };