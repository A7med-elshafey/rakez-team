import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

const BASE_URL = (import.meta.env.VITE_PROJECTS_BASE_URL || "https://rakez-team.s3.eu-north-1.amazonaws.com").replace(/\/+$/g, "");
const DEFAULT_MEDIA_URL = "https://rakez-team.s3.eu-north-1.amazonaws.com/welcome/Welcome-Rkez.jpeg";
const DEFAULT_WELCOME_MESSAGE =
  "أهلاً بك في بوابة فريق راكز. نتمنى لك يومًا مليئًا بالإنجاز والتقدّم. ✨";

function resolveMediaUrl(url) {
  const value = String(url || "").trim();
  if (!value) return DEFAULT_MEDIA_URL;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return value;
  return `${BASE_URL}/${value.replace(/^\/+/, "")}`;
}

function isVideoUrl(url) {
  const clean = String(url || "").split("?")[0].split("#")[0].toLowerCase();
  return /\.(mp4|webm|ogg|mov|m4v)$/.test(clean);
}

export default function WelcomeOverlay() {
  const { showWelcome, session } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (showWelcome && session) {
      setVisible(true);
      timer = setTimeout(() => setVisible(false), 10000);
    } else {
      timer = setTimeout(() => setVisible(false), 1);
    }
    return () => clearTimeout(timer);
  }, [showWelcome, session]);

  if (!visible) return null;

  const message = session?.welcomeMessage || DEFAULT_WELCOME_MESSAGE;
  const mediaUrl = resolveMediaUrl(session?.welcomeMedia);

  return (
    <div
      className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-500 ${
        showWelcome ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-lg bg-gradient-to-br from-primary/10 via-white to-secondary/20 backdrop-blur-md border border-black/5 shadow-2xl rounded-3xl p-10 text-center transition-transform duration-500 transform animate-in fade-in zoom-in">
        <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-secondary/40 bg-white/70">
          {isVideoUrl(mediaUrl) ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-56 object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Welcome"
              className="w-full h-56 object-cover"
            />
          )}
        </div>

        <h3 className="mt-5 text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Rakez Team Portal 💼
        </h3>

        <div className="mx-auto mt-5 h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center shadow-lg ring-1 ring-secondary/50">
          <span className="text-4xl">✅💪</span>
        </div>
  
        <p className="mt-2 text-xl font-semibold text-gray-800">
          {session?.fullName || session?.name}
        </p>

        <p className="mt-4 text-lg font-medium text-gray-700 italic leading-8">
          {message}
        </p>
      </div>
    </div>
  );
}
// git remote add origin https://github.com/A7med-elshafey/rakez-team.git
// git branch -M main
// git push -u origin main