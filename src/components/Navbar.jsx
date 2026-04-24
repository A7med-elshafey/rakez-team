import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { logout, session } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const linkBase =
    "px-4 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border shadow-sm";
  const linkActive =
    "bg-[#D8CDBB] text-[#1E2D3E] border-[#D8CDBB] shadow-[0_10px_30px_rgba(216,205,187,0.28)]";
  const linkIdle =
    "text-white border-white/10 bg-white/5 hover:bg-[#D8CDBB] hover:text-[#1E2D3E] hover:border-[#D8CDBB] hover:-translate-y-0.5";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1E2D3E]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
          : "bg-[#1E2D3E]"
      }`}
      dir="rtl"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-row-reverse">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-[22px] bg-white/8 border border-white/15 p-2 shadow-inner">
            <img
              src="/assets/logo/logo.png"
              alt="RAKEZ"
              className="h-11 w-auto object-contain"
            />
          </div>

          <div className="leading-tight min-w-0">
            <div className="font-extrabold text-[#D8CDBB] text-base drop-shadow truncate">
              راكز العقارية
            </div>
            <div className="text-white/85 text-sm">Team Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <Link
            to="/"
            className={`${linkBase} ${pathname === "/" ? linkActive : linkIdle}`}
          >
            الرئيسية
          </Link>

          <Link
            to="/projects"
            className={`${linkBase} ${
              pathname.startsWith("/projects") ? linkActive : linkIdle
            }`}
          >
            المشاريع
          </Link>

          {session ? (
            <button
              onClick={handleLogout}
              className="mr-1 px-4 py-2.5 rounded-2xl bg-white/7 border border-white/10 text-white text-sm font-bold hover:bg-[#D8CDBB] hover:text-[#1E2D3E] hover:border-[#D8CDBB] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
            >
              تسجيل خروج
            </button>
          ) : (
            <Link
              to="/login"
              className="mr-1 px-4 py-2.5 rounded-2xl bg-[#D8CDBB] border border-[#D8CDBB] text-[#1E2D3E] text-sm font-extrabold hover:bg-[#cbbda8] hover:border-[#cbbda8] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_10px_30px_rgba(216,205,187,0.25)]"
            >
              تسجيل دخول
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
