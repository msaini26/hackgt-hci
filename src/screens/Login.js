// src/screens/Login.js
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Signed in with Google");
      // User will be automatically redirected to Dashboard via App.js
    } catch (e) {
      setErr(e.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: implement email/password with createUserWithEmailAndPassword or signInWithEmailAndPassword
    console.log("email/password submit");
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 320, padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <div style={{ textAlign: "center", margin: "8px 0" }}>or</div>

        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required
              style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required
              style={{ width: "100%", padding: 8, marginTop: 4 }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: 10, marginTop: 8 }}>
            Login
          </button>
        </form>

        {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
      </div>
    </div>
  );
}
