// src/screens/Login.js
import * as React from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { SiGoogle } from "react-icons/si";
import Logo from "../assets/logo.svg";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const svgBackground = encodeURIComponent(`
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="rgba(108, 99, 255, 0.20)" d="M55.4,-54.4C71.5,-52.6,84,-34.8,86.6,-15.9C89.1,3,81.7,22.9,70.5,39.1C59.2,55.3,44.2,67.6,30.1,65.2C15.9,62.8,2.8,45.7,-10.5,37.2C-23.7,28.7,-37,28.9,-41.7,23C-46.3,17.1,-42.3,5.2,-40,-7C-37.8,-19.1,-37.3,-31.5,-30.9,-35C-24.5,-38.5,-12.3,-33.2,3.7,-37.6C19.7,-42,39.4,-56.2,55.4,-54.4Z" transform="translate(100 100)" />
</svg>
`);

const secondarySvgBackground = encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="rgba(108, 99, 255, 0.20)" d="M23.3,-30.4C35.6,-17.5,54.5,-15.2,61.9,-6.1C69.2,3.1,65,19.1,57,32.8C48.9,46.5,37.1,57.9,23.6,61.4C10,64.9,-5.2,60.4,-15.2,52.2C-25.2,44,-30.1,32.1,-34.1,21.5C-38.1,10.8,-41.2,1.5,-41,-8.6C-40.9,-18.7,-37.5,-29.6,-30.1,-43.3C-22.7,-57.1,-11.3,-73.6,-2.9,-70.1C5.5,-66.6,11.1,-43.2,23.3,-30.4Z" transform="translate(100 100)" />
</svg>
`);

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
    
    <div
  style={{
   position: "relative",
    width: "100%",
    height: "auto",
    backgroundImage: `url("data:image/svg+xml,${svgBackground}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "1000px 1000px",
  }}
>
  <div
  style={{
    position: "relative",           // fixes it relative to the viewport
    bottom: 0,                   // aligns to bottom
    left: 0,                     // aligns to left
    width: "auto",               // adjust width as needed
    height: "auto",              // adjust height as needed
    backgroundImage: `url("data:image/svg+xml,${secondarySvgBackground}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom left", // ensures image starts at bottom-left
    backgroundSize: "1000px 1000px",   // adjust size as needed
    zIndex: 0,                          // behind your content
  }}
>
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "280px" }}>
      <img
        src={Logo}
        alt="Logo"
        style={{
          position: "absolute", // allows overlapping
          top: "50px", // distance from top
          left: "50%", // center horizontally
          transform: "translateX(-50%)", // center exactly
          width: "250px",
          height: "auto",
          zIndex: 2,
          paddingBottom: "20px", // higher than login UI
        }}
      />
      <div
        style={{
          width: 320,
          padding: 24,
          backgroundColor: "#e8e8e8ff",
          border: "1px solid #ccc",
          borderRadius: 8,
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <Button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width: "100%", padding: 10, marginBottom: 12, backgroundColor: "#4540a7ff" }}
        >
          <SiGoogle size={20} style={{ marginRight: 8 }} />
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>

        <div style={{ textAlign: "center", margin: "8px 0" }}>or</div>

        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <div style={{ paddingBottom: 7 }}></div>
            <Input
              type="email"
              placeholder="Enter your email"
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <div style={{ paddingBottom: 7 }}></div>
            <Input
              type="password"
              placeholder="Enter your password"
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <Button
            type="submit"
            style={{ width: "100%", padding: 10, marginTop: 8, backgroundColor: "#6c63ff" }}
          >
            Login
          </Button>
        </form>

        {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
