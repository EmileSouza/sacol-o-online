import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sacolao-online-6aece.firebaseapp.com",
  projectId: "sacolao-online-6aece",
  storageBucket: "sacolao-online-6aece.firebasestorage.app",
  messagingSenderId: "970525944604",
  appId: "1:970525944604:web:ce0b5182c9b786f7e2a8d9",
  measurementId: "G-8MRVDLRPT0"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
console.log("Projeto Firebase:", firebaseConfig.projectId)


