// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyAixa-fYGEjPWMpi2B2pbFEswSl3VUJv8U",
  // authDomain: "fir-web-70b6f.firebaseapp.com",
  // projectId: "fir-web-70b6f",
  // storageBucket: "fir-web-70b6f.appspot.com",
  // messagingSenderId: "135349629762",
  // appId: "1:135349629762:web:3dc1c8dba128dee9248edb",
  // measurementId: "G-ELWRN80LCT"
  apiKey: "AIzaSyC7y04N7EgojXEvSNUyAD9Qd1NLrDcQeC4",
  authDomain: "sticky-notes-603f3.firebaseapp.com",
  projectId: "sticky-notes-603f3",
  storageBucket: "sticky-notes-603f3.appspot.com",
  messagingSenderId: "1099136237676",
  appId: "1:1099136237676:web:59853edc20a0048219d849",
  measurementId: "G-P3GQPMWXY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
export {analytics, auth, firestore}