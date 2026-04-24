import { useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { login as doLogin, logout as doLogout, getSession } from "../services/auth";

export default function AuthProvider({ children }) {
  // IMPORTANT: read session synchronously to avoid "delayed" login route / flicker
  const initialSession = getSession();
  const [session, setSession] = useState(initialSession);
  const [loginOpen, setLoginOpen] = useState(() => !initialSession);
  const [showWelcome, setShowWelcome] = useState(false);
  const ready = true;

  // Auto-logout when expired
  useEffect(() => {
    if (!session?.expiresAt) return;
    const ms = Math.max(0, session.expiresAt - Date.now());
    const t = setTimeout(() => {
      doLogout();
      setSession(null);
      setLoginOpen(true);
    }, ms);
    return () => clearTimeout(t);
  }, [session?.expiresAt]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const login = useCallback(async (username, password) => {
    try {
      const s = await doLogin(username, password);
      setSession(s);
      setLoginOpen(false);
      setShowWelcome(true);
      // Keep welcome visible long enough for the user to read and see the media
      setTimeout(() => setShowWelcome(false), 10000);

      return s;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setSession(null);
    setLoginOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      session,
      ready,
      login,
      logout,
      loginOpen,
      openLogin,
      closeLogin,
      showWelcome,
    }),
    [session, ready, login, logout, loginOpen, openLogin, closeLogin, showWelcome]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
