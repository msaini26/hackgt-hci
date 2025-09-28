import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7qNwEK6M3qPlx74eqYdNXJ86aAILmLdM",
  authDomain: "hackgt-77260.firebaseapp.com",
  projectId: "hackgt-77260",
  storageBucket: "hackgt-77260.firebasestorage.app",
  messagingSenderId: "1047453847385",
  appId: "1:1047453847385:web:e419aaad81d80eab79c648",
  measurementId: "G-8GRZ4X3LTM",
};

// Add localhost to authorized domains for development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // This helps with local development
  console.log('Running in localhost mode');
}

export const app = initializeApp(firebaseConfig);
console.log("Hello this is for testing")
console.log(app)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

isSupported().then((ok) => {
  if (ok) getAnalytics(app);
});
