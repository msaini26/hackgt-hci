// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFC_Kue9Cy7LKXUjc-lWCEvQLYwFEz9JU",
  authDomain: "email-notifs-32e10.firebaseapp.com",
  projectId: "email-notifs-32e10",
  storageBucket: "email-notifs-32e10.firebasestorage.app",
  messagingSenderId: "113210454379",
  appId: "1:113210454379:web:2613a194d71e0e0a0a1c2e",
  measurementId: "G-EGSL1KZXLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { app, messaging };