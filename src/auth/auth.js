
// src/auth/auth.js (compat wrapper)
// Kept for existing imports. Internally forwards to services/auth.

import { getSession, login as doLogin, logout as doLogout } from "../services/auth";

export function isLoggedIn(){
  return !!getSession();
}

export function getUser(){
  const s = getSession();
  return s ? (s.fullName || s.username) : null;
}

export async function loginSave(user){
  // Backward-compat API that previously accepted a user object with username/password.
  // We'll expect { username, password } and call the new login.
  if (user && user.username && user.password){
    await doLogin(user.username, user.password);
  }
  return getSession();
}

export function logout(){
  try { localStorage.removeItem("bayut_user"); } catch {}
  doLogout();
}
