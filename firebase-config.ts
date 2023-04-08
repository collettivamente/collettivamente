// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export default function initFirebase() {

  if (!getApps().length) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const analytics = isSupported().then(yes => yes ? initializeAnalytics(app) : null);
    const auth = initializeAuth(app);
  }
  return getApp();
}
