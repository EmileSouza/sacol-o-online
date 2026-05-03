import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBgZMG5EAZEx2emDXnjwe-67YYFYkTMGjs",
  authDomain: "sacolao-online-6aece.firebaseapp.com",
  projectId: "sacolao-online-6aece",
 storageBucket: "sacolao-online-6aece.appspot.com",
  messagingSenderId: "970525944604",
  appId: "1:970525944604:web:6c651ac6f753217be2a8d9",
  measurementId: "G-7VS307GNS8"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
