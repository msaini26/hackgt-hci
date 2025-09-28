// src/App.js
import "./App.css";
import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for development bypass
    const devUser = localStorage.getItem('dev-auth-user');
    if (devUser && process.env.NODE_ENV === 'development') {
      try {
        const mockUser = JSON.parse(devUser);
        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing dev user:', error);
        localStorage.removeItem('dev-auth-user');
      }
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}
