import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjects } from "../services/api";

const categoryMeta = {
  apartments: { label: "الشقق", accent: "#D8CDBB" },
  towers: { label: "الأبراج", accent: "#D8CDBB" },
  villas: { label: "الفلل", accent: "#D8CDBB" },
  floors: { label: "الأدوار", accent: "#D8CDBB" },
};

function formatHandoverDate(value) {
  if (!value) return "";
  const str = String(value).trim();
  if (/^\d{4}$/.test(str)) return str;
  if (/^\d{4}-\d{1,2}$/.test(str)) {
    const [y, m] = str.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(d);
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(y, m - 1, d));
  }
  return str;
}

function getSortValue(value) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const str = String(value).trim();
  if (/^\d{4}$/.test(str)) return new Date(Number(str), 0, 1).getTime();
  if (/^\d{4}-\d{1,2}$/.test(str)) {
    const [y, m] = str.split("-").map(Number);
    return new Date(y, m - 1, 1).getTime();
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  const ts = Date.parse(str);
  return Number.isNaN(ts) ? Number.MAX_SAFE_INTEGER : ts;
}

function ActionLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 px-3.5 py-2.5 bg-[#1E2D3E]/4 rounded-2xl text-[#1E2D3E] text-sm border border-transparent hover:bg-[#D8CDBB] hover:text-[#1E2D3E] hover:border-[#D8CDBB] hover:-translate-y-0.5 transition-all duration-300"
      title={label}
    >
      <span role="img" aria-label={label}>{icon}</span>
      <span className="font-semibold">{label}</span>
    </Link>
  );
}

export default function CategoryProjects() {
  const { category } = useParams();
  const categoryLabel = categoryMeta[category]?.label || category;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProjects()
      .then((data) => {
        if (!mounted) return;
        setProjects(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const sortedProjects = useMemo(() => {
    return projects
      .filter((project) => project?.category?.key === category)
      .sort((a, b) => getSortValue(a?.handoverDate) - getSortValue(b?.handoverDate));
  }, [projects, category]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10" dir="rtl">
        <div className="p-6 bg-white rounded-3xl border border-black/5 text-[#5b6574] text-right shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          جارِ التحميل…
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-10" dir="rtl">
      <div className="mb-8 rounded-[30px] bg-[linear-gradient(135deg,#1E2D3E_0%,#24384d_60%,#314964_100%)] text-white p-7 shadow-[0_25px_70px_rgba(30,45,62,0.22)] border border-white/10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-right">{categoryLabel}</h1>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="p-6 bg-white rounded-3xl border border-black/5 text-[#5b6574] text-right shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          لا توجد مشاريع مطابقة
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2">
          {sortedProjects.map((project) => {
            const handover = formatHandoverDate(project?.handoverDate);
            return (
              <div
                key={project.id}
                className="group bg-white/95 rounded-[30px] shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_65px_rgba(30,45,62,0.14)] p-5 border border-black/5 hover:border-[#D8CDBB] transition-all duration-300 hover:-translate-y-1"
              >
                {project.cover && (
                  <div className="overflow-hidden rounded-[24px] mb-4 bg-[#eef1f5]">
                    <img
                      src={project.cover}
                      alt={project.name || project.id}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="text-left shrink-0">
                    {handover ? (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-[#F5F1E8] text-[#1E2D3E] font-extrabold inline-block border border-[#D8CDBB]">
                        التسليم: {handover}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-right flex-1">
                    <h2 className="text-xl font-extrabold text-[#1E2D3E]">{project.name}</h2>
                    <div className="text-sm text-[#6b7280] mt-1">{project?.category?.label || categoryLabel}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <ActionLink to={`/projects/${category}/${project.id}/videos`} icon="🎬" label="الفيديوهات" />
                  <ActionLink to={`/projects/${category}/${project.id}/images`} icon="🖼️" label="الصور" />
                  <ActionLink to={`/projects/${category}/${project.id}/pdfs`} icon="📄" label="ملفات PDF" />
                  <ActionLink to={`/projects/${category}/${project.id}/info`} icon="ℹ️" label="معلومات إضافية" />
                  <ActionLink to={`/projects/${category}/${project.id}/location`} icon="📍" label="الموقع" />
                  <ActionLink to={`/projects/${category}/${project.id}/prices`} icon="💰" label="قائمة الأسعار" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
