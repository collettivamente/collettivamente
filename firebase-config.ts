// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgkNJtSZg-Na-wvoMIPmfdTBoNUbaeG-Q",
  authDomain: "socialmente-a36cb.firebaseapp.com",
  projectId: "socialmente-a36cb",
  storageBucket: "socialmente-a36cb.appspot.com",
  messagingSenderId: "989216334200",
  appId: "1:989216334200:web:1e6b762decdbee39d3e88d",
  measurementId: "G-N99SJ58NKG"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
