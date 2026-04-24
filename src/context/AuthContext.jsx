
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession as authGet, login as authLogin, logout as authLogout } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authGet());
  const [showWelcome, setShowWelcome] = useState(false);

  // refresh session on mount
  useEffect(() => {
    setSession(authGet());
  }, []);

  // auto-logout timer based on expiry
  useEffect(() => {
    if (!session?.expiresAt) return;
    const ms = Math.max(0, session.expiresAt - Date.now());
    const t = setTimeout(() => {
      authLogout();
      setSession(null);
    }, ms);
    return () => clearTimeout(t);
  }, [session?.expiresAt]);

  const login = async (u, p) => {
    const s = await authLogin(u, p);
    setSession(s);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 1000);
    return s;
  };
  const logout = () => {
    authLogout();
    setSession(null);
  };

  const value = useMemo(() => ({ session, login, logout, showWelcome }), [session, showWelcome]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
