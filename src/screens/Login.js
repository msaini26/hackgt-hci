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
      // Add redirect URI configuration for localhost
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      await signInWithPopup(auth, googleProvider);
      console.log("Signed in with Google");
      // User will be automatically redirected to Dashboard via App.js
    } catch (e) {
      console.error("Google sign-in error:", e);
      if (e.code === 'auth/popup-closed-by-user') {
        setErr("Sign-in was cancelled. Please try again.");
      } else if (e.code === 'auth/redirect-uri-mismatch') {
        setErr("OAuth configuration error. Please check the setup guide in FIREBASE_OAUTH_FIX.md");
      } else {
        setErr(e.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: implement email/password with createUserWithEmailAndPassword or signInWithEmailAndPassword
    console.log("email/password submit");
  };

  // Development bypass for testing
  const handleDevLogin = () => {
    console.log("Development login bypass");
    // Simulate successful authentication by setting a mock user
    const mockUser = {
      uid: 'dev-user-123',
      displayName: 'Development User',
      email: 'dev@example.com',
      photoURL: null
    };
    
    // Store mock user in localStorage for the app to recognize
    localStorage.setItem('dev-auth-user', JSON.stringify(mockUser));
    
    // Reload to trigger authentication state change
    window.location.reload();
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
        
        {/* Development bypass - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 4, border: '1px solid #dee2e6' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
              <strong>Development Mode:</strong> If Google login fails due to OAuth configuration, you can bypass authentication for testing.
            </p>
            <button 
              onClick={handleDevLogin}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🚧 Skip Authentication (Dev Only)
            </button>
            <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#999' }}>
              See FIREBASE_OAUTH_FIX.md for proper OAuth setup
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
