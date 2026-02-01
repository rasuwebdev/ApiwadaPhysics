// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_hDpsNq60hwsEYGIAWFkn7LgLYPoD2D8",
  authDomain: "apiwada.firebaseapp.com",
  projectId: "apiwada",
  storageBucket: "apiwada.firebasestorage.app",
  messagingSenderId: "1077007378629",
  appId: "1:1077007378629:web:c1f9be4b951770b29ee8ac",
  measurementId: "G-71ZETYBFM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
