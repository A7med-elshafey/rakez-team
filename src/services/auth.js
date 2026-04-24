// src/services/auth.js
// Lightweight client-side auth with 24h expiry and best-effort single-device binding.
// NOTE: Real single-device enforcement requires a backend. This is a client-only best effort.

const SESSION_KEY = "bt.auth";
const DEVICE_KEY = "bt.deviceId";
const BINDINGS_KEY = "bt.bindings"; // { [username]: deviceId }

function uuid() {
  // RFC4122-ish v4
  const tpl = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).toString();
  return tpl.replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export async function loadUsers() {
  const res = await fetch("/users.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load users.json");
  const data = await res.json();
  return Array.isArray(data) ? data : data.users || [];
}

export function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getBindings() {
  try {
    return JSON.parse(localStorage.getItem(BINDINGS_KEY) || "{}");
  } catch {
    return {};
  }
}
export function setBindings(obj) {
  localStorage.setItem(BINDINGS_KEY, JSON.stringify(obj || {}));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // validate expiry + device
    const now = Date.now();
    const deviceId = getOrCreateDeviceId();
    if (
      !s ||
      !s.username ||
      s.deviceId !== deviceId ||
      !s.expiresAt ||
      now >= s.expiresAt
    ) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(username, password) {
  username = String(username || "")
    .trim()
    .toLowerCase();
  password = String(password || "");

  const users = await loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("Invalid username or password");

  const deviceId = getOrCreateDeviceId();
  const bindings = getBindings();
  const bound = bindings[username];
  if (bound && bound !== deviceId) {
    throw new Error("This account is already in use on another device.");
  }

  // bind user -> device
  bindings[username] = deviceId;
  setBindings(bindings);

  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24h

  const session = {
    username,
    fullName: user.fullName || username,
    welcomeMessage: user.welcomeMessage || "",
    welcomeMedia: user.welcomeMedia || "",
    loginAt: now,
    expiresAt,
    deviceId,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Keep legacy key for existing UI that reads 'bayut_user'
  try {
    localStorage.setItem(
      "bayut_user",
      JSON.stringify({ username: user.fullName || username })
    );
  } catch {}

  return session;
}
