import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getToken, setToken } from "../api/client";

// Now backed by the real Express API (JWT auth). Falls back to a clear
// error state if the backend isn't running rather than silently mocking.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const { user } = await authApi.me();
        setUser(user);
      } catch {
        setToken(null); // stale/expired token
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function login({ email, password }) {
    try {
      const { token, user } = await authApi.login({ email, password });
      setToken(token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function signup({ name, email, password, confirmPassword, role = "citizen" }) {
    try {
      const { token, user } = await authApi.signup({ name, email, password, confirmPassword, role });
      setToken(token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function loginWithProvider(provider) {
    try {
      const { token, user } = await authApi.oauth(provider);
      setToken(token);
      setUser(user);
      const label = provider === "google" ? "Google" : "LinkedIn";
      return { ok: true, label };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
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
