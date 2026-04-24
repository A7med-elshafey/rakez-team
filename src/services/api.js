// src/services/api.js

const DEFAULT_BASE = "https://rakez-team.s3.eu-north-1.amazonaws.com";
const RAW_BASE = import.meta.env.VITE_PROJECTS_BASE_URL || DEFAULT_BASE;

// remove trailing slashes to avoid double //
export const API_BASE = RAW_BASE.replace(/\/+$/g, "");

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/index.json?ts=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("فشل تحميل المشاريع");
    return res.json();
  } catch (err) {
    console.error("خطأ أثناء تحميل المشاريع:", err);
    return [];
  }
}

export async function getProject(id) {
  try {
    const res = await fetch(
      `${API_BASE}/projects-data/${id}.json?ts=${Date.now()}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("فشل تحميل المشروع");
    return res.json();
  } catch (err) {
    console.error("خطأ أثناء تحميل المشروع:", err);
    return null;
  }
}

export function resolveUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
}
