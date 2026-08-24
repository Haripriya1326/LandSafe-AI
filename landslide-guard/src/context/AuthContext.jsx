import { createContext, useContext, useEffect, useState } from "react";

// Mock, frontend-only auth for the SIH demo — there is no backend here, so
// this only validates input shape and persists a session locally. Swap the
// two functions below 1:1 for real API calls when a backend exists.
const AuthContext = createContext(null);
const STORAGE_KEY = "landslide-guard-session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // corrupted/blocked storage — treat as logged out
    }
    setReady(true);
  }, []);

  function persist(nextUser) {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_KEY);
  }

  function login({ email, password }) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) return { ok: false, error: "Enter a valid email address." };
    if (!password || password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    // Mock check — any well-formed credentials succeed since there's no real backend yet.
    const name = email.trim().split("@")[0];
    persist({ name, email: email.trim() });
    return { ok: true };
  }

  function signup({ name, email, password, confirmPassword }) {
    if (!name.trim()) return { ok: false, error: "Enter your full name." };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) return { ok: false, error: "Enter a valid email address." };
    if (!password || password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (password !== confirmPassword) return { ok: false, error: "Passwords don't match." };
    persist({ name: name.trim(), email: email.trim() });
    return { ok: true };
  }

  // Mock OAuth — a real Google/LinkedIn sign-in needs a registered OAuth
  // client ID and a backend to exchange the auth code for a verified
  // profile, neither of which exist in this frontend-only demo. This
  // simulates the round trip so the flow and UI are ready to wire up.
  function loginWithProvider(provider) {
    const label = provider === "google" ? "Google" : "LinkedIn";
    const demoProfile = {
      google: { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
      linkedin: { name: "Arjun Mehta", email: "arjun.mehta@linkedin.com" },
    }[provider];
    persist({ ...demoProfile, provider });
    return { ok: true, label };
  }

  function logout() {
    persist(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout, loginWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
