// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-ad4af.firebaseapp.com",
  projectId: "authexamnotes-ad4af",
  storageBucket: "authexamnotes-ad4af.firebasestorage.app",
  messagingSenderId: "899522505937",
  appId: "1:899522505937:web:4f0768cc8f2b7587e869f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();

export { auth, provider };