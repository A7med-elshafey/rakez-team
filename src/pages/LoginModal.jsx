import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginModal({ open }) {
  const { login, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-black/5 overflow-hidden">
        <div className="bg-primary px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-2">
                <img
                  src="/assets/logo/logo.png"
                  alt="RAKEZ"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold leading-tight">راكز العقارية</div>
                <div className="text-xs text-white/80">بوابة الفريق الداخلية</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-1">
              اسم المستخدم
            </label>
            <input
              className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-white text-right"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              inputMode="text"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-white text-right"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-secondary text-primary py-3 font-extrabold hover:bg-secondary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "جارِ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

          <div className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} راكز العقارية
          </div>
        </form>
      </div>
    </div>
  );
}
