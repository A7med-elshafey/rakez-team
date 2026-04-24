import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Home, Building, Layers, ArrowUpLeft } from "lucide-react";
import { fetchProjects } from "../services/api";

function ProjectCategory({ icon: Icon, title, path, subtitle }) {
  return (
    <motion.div
      className="w-full sm:w-[46%] lg:w-[23%]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to={`/projects/${path}`}
        className="group block h-full rounded-[28px] border border-[#1E2D3E]/8 bg-white/90 backdrop-blur-md p-6 shadow-[0_18px_45px_rgba(17,24,39,0.08)] hover:shadow-[0_24px_60px_rgba(30,45,62,0.16)] hover:-translate-y-1 transition-all duration-300"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E2D3E]/6 text-[#1E2D3E] group-hover:bg-[#D8CDBB] group-hover:text-[#1E2D3E] transition-all duration-300">
            <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <ArrowUpLeft className="w-5 h-5 text-[#1E2D3E]/35 group-hover:text-[#1E2D3E] transition-colors duration-300" />
        </div>

        <h2 className="text-2xl font-extrabold text-[#1E2D3E] mb-2">{title}</h2>
        <p className="text-sm text-[#556070] mb-6 leading-7">{subtitle}</p>

        <div className="rounded-2xl px-4 py-3 bg-[#F5F1E8] border border-[#D8CDBB] text-center font-bold text-[#1E2D3E] group-hover:bg-[#1E2D3E] group-hover:text-white group-hover:border-[#1E2D3E] transition-all duration-300">
          عرض المشاريع
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  const [allProjects, setAllProjects] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [q, setQ] = useState("");

  const normalize = (s) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "")
      .replace(/ـ/g, "")
      .replace(/\s+/g, " ")
      .trim();

  useEffect(() => {
    let mounted = true;
    fetchProjects()
      .then((data) => mounted && setAllProjects(Array.isArray(data) ? data : []))
      .finally(() => mounted && setLoadingSearch(false));
    return () => {
      mounted = false;
    };
  }, []);

  const searchTerm = normalize(q);
  const results = useMemo(() => {
    if (!searchTerm) return [];
    return allProjects.filter((p) => {
      const name = normalize(p?.name);
      const id = normalize(p?.id);
      return name.includes(searchTerm) || id.includes(searchTerm);
    });
  }, [allProjects, searchTerm]);

  const isSearching = q.trim().length > 0;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden px-4 sm:px-8 py-24 bg-[linear-gradient(180deg,#f6f2ea_0%,#f8fafc_100%)]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(216,205,187,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(30,45,62,0.08),transparent_35%)]" />

      <motion.h1
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-6xl font-extrabold text-center text-[#1E2D3E] mb-4 tracking-wide"
      >
        مشاريع الخارطة
      </motion.h1>


      <div className="mx-auto max-w-3xl mb-8 flex items-center justify-center gap-3">
        {q && (
          <button
            onClick={() => setQ("")}
            className="text-sm font-bold text-[#1E2D3E] hover:text-[#b79f78] transition-colors"
          >
            مسح
          </button>
        )}
        <input
          type="search"
          placeholder="ابحث باسم المشروع أو الكود"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-[20px] border border-[#d9dee7] px-5 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:outline-none focus:ring-2 focus:ring-[#D8CDBB] focus:border-[#D8CDBB] text-right bg-white transition-all"
          aria-label="بحث باسم المشروع"
        />
      </div>

      {isSearching ? (
        loadingSearch ? (
          <div className="mx-auto max-w-3xl p-4 bg-white/85 rounded-2xl text-[#5b6574] text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-black/5">
            جارِ التحميل…
          </div>
        ) : results.length === 0 ? (
          <div className="mx-auto max-w-3xl p-4 bg-white/85 rounded-2xl text-[#5b6574] text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-black/5">
            لا توجد نتائج مطابقة لبحث “{q}”
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3 mb-10">
            {results.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Link
                  to={`/projects/${p?.category?.key}/${p.id}/pdfs`}
                  className="group flex items-center gap-3 rounded-[22px] border border-[#e7ebf1] bg-white hover:border-[#D8CDBB] hover:shadow-[0_18px_36px_rgba(30,45,62,0.10)] transition-all p-3"
                  title={p.name}
                >
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt={p.name || p.id}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 text-right flex-1">
                    <div className="font-bold text-[#1E2D3E] truncate group-hover:text-[#b79f78] transition-colors">
                      {p.name}
                    </div>
                    <div className="text-xs text-[#6b7280] mt-1">{p?.category?.label}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )
      ) : null}

      <div className="flex flex-wrap justify-center gap-6">
        <ProjectCategory icon={Home} title="الشقق" path="apartments" subtitle="وحدات سكنية متنوعة داخل المشاريع المتاحة." />
        <ProjectCategory icon={Building2} title="الأبراج" path="towers" subtitle="مشاريع الأبراج السكنية والاستثمارية." />
        <ProjectCategory icon={Building} title="الفلل" path="villas" subtitle="فلل مستقلة ومجتمعات سكنية متكاملة." />
        <ProjectCategory icon={Layers} title="الأدوار" path="floors" subtitle="أدوار سكنية بتفاصيل واضحة وسريعة الوصول." />
      </div>
    </div>
  );
}
