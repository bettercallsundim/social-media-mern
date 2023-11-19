// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdOxaxgrxmfkjar8VE09iU_W7ZDvvfdv0",
  authDomain: "social-media-7692f.firebaseapp.com",
  projectId: "social-media-7692f",
  storageBucket: "social-media-7692f.appspot.com",
  messagingSenderId: "377573366533",
  appId: "1:377573366533:web:1bc524b1e5f6e5a039356c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add a new document in collection "cities"
async function dbs() {
  await setDoc(doc(db, "cities", "testt2"), {
    name: "testt2",
    state: "testt2",
    country: "testt2",
  }).then(() => {
    const cityRef = doc(db, "cities", "Dhaka");
    console.log(cityRef);
  });
}
dbs();
