import { createContext, useContext } from "react";

export const AuthContext = createContext({
  session: null,              // { username, name, loginAt, expiresAt }
  ready: true,                // auth is ready (session read)
  loginOpen: true,            // show login modal on top of Home when not logged
  showWelcome: false,         // transient welcome overlay after login
  login: async (_u, _p) => {}, 
  logout: () => {},
  openLogin: () => {},
  closeLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);
