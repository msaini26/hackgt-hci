import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// firebase config
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Functions for Google Sign-In / Sign-Out
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in user:", user);
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

export { auth };
