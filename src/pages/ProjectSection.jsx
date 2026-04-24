import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject } from "../services/api";

function labelFromUrl(u) {
  try {
    const raw = typeof u === "string" ? u : (u?.url || "");
    const last = raw.split("/").pop().split("?")[0];
    const noExt = last.includes(".") ? last.substring(0, last.lastIndexOf(".")) : last;
    return noExt
      .replace(/[-_]/g, " ")
      .replace(/(\d+)(bed)/i, "$1 Bed")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return String(u);
  }
}

function iconFor(section) {
  switch (section) {
    case "videos": return "🎬";
    case "images": return "🖼️";
    case "pdfs": return "📄";
    case "info": return "ℹ️";
    case "location": return "📍";
    case "prices": return "💰";
    default: return "🔗";
  }
}

function sectionLabel(key) {
  switch (key) {
    case "videos": return "الفيديوهات";
    case "images": return "الصور";
    case "pdfs": return "ملفات PDF";
    case "info": return "معلومات إضافية";
    case "location": return "الموقع";
    case "prices": return "قائمة الأسعار";
    default: return key;
  }
}

function toItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) =>
      typeof x === "string"
        ? { url: x, label: labelFromUrl(x) }
        : { url: x?.url, label: x?.label || labelFromUrl(x?.url || "") }
    )
    .filter((it) => !!it.url);
}

function ActionTab({ category, projectId, tabKey, activeSection }) {
  const active = activeSection === tabKey;
  return (
    <Link
      to={`/projects/${category}/${projectId}/${tabKey}`}
      className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${
        active
          ? "bg-[#1E2D3E] text-white border-[#1E2D3E] shadow-[0_14px_30px_rgba(30,45,62,0.18)]"
          : "bg-white text-[#1E2D3E] border-[#d9dee7] hover:bg-[#D8CDBB] hover:border-[#D8CDBB] hover:-translate-y-0.5"
      }`}
    >
      <span className="ml-1">{iconFor(tabKey)}</span>
      {sectionLabel(tabKey)}
    </Link>
  );
}

export default function ProjectSection() {
  const { category, id, section } = useParams();
  const activeSection = section || "videos";

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const p = await getProject(id);
        setProject(p || null);
      } catch {
        setProject(undefined);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 pt-28">جارِ التحميل…</div>;
  if (project === undefined) return <div className="max-w-7xl mx-auto px-4 pt-28">تعذر تحميل المشروع</div>;
  if (!project) return <div className="max-w-7xl mx-auto px-4 pt-28">المشروع غير موجود</div>;

  const rawSections = project.sections || {
    videos: project.videos,
    images: project.images,
    gallery: project.gallery,
    photos: project.photos,
    pdfs: project.pdfs,
    info: project.info,
    location: project.location,
    prices: project.prices,
  };

  const S = Object.fromEntries(Object.entries(rawSections).filter(([, value]) => !!value));
  const imagesSection = S.images || S.gallery || S.photos;

  const sectionData = {
    title: (activeSection === "images" ? imagesSection?.title : S[activeSection]?.title) || "",
    items: toItems((activeSection === "images" ? imagesSection?.items : S[activeSection]?.items) || []),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-10" dir="rtl">
      <div className="rounded-[32px] bg-white/90 border border-black/5 shadow-[0_24px_60px_rgba(15,23,42,0.10)] overflow-hidden">
        {project.cover && (
          <div className="bg-[#eef1f5]">
            <img
              src={project.cover}
              alt={project.name || project.id}
              className="w-full h-[260px] md:h-[420px] object-cover"
            />
          </div>
        )}

        <div className="p-5 md:p-7">
          <div className="flex flex-wrap gap-3 mb-6">
            {["videos", "images", "pdfs", "info", "location", "prices"].map((key) => (
              <ActionTab
                key={key}
                category={category}
                projectId={project.id}
                tabKey={key}
                activeSection={activeSection}
              />
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#1E2D3E] mb-2">{project.name}</h1>
            <p className="text-[#667085] text-base">{sectionData.title || sectionLabel(activeSection)}</p>
          </div>

          {activeSection === "videos" && (
            <div className="mt-2">
              {isVideoOpen && selectedVideo && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => {
                    setIsVideoOpen(false);
                    setSelectedVideo(null);
                  }}
                >
                  <div
                    className="relative w-full max-w-5xl h-[78vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <video
                      src={selectedVideo}
                      className="w-full h-full object-contain bg-black rounded-2xl shadow-2xl"
                      controls
                      autoPlay
                      playsInline
                    />
                    <button
                      onClick={() => {
                        setIsVideoOpen(false);
                        setSelectedVideo(null);
                      }}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition"
                    >
                      إغلاق ✖
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectionData.items.length ? (
                  sectionData.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVideo(item.url);
                        setIsVideoOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group text-right bg-white rounded-2xl shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_40px_rgba(30,45,62,0.14)] transition-all duration-300 overflow-hidden border border-[#e7ebf1] hover:border-[#D8CDBB] hover:-translate-y-1"
                      title={item.label}
                    >
                      <div className="relative h-40 bg-black">
                        <video
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                          src={item.url}
                          muted
                          preload="metadata"
                          playsInline
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 right-3 left-3 text-sm text-white font-bold line-clamp-1">
                          {item.label}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-4 rounded-2xl bg-[#f3f4f6] text-[#6b7280] text-center col-span-full">
                    لا يوجد فيديوهات
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "images" && (
            <div className="mt-2">
              {isImageOpen && selectedImage && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => {
                    setIsImageOpen(false);
                    setSelectedImage(null);
                  }}
                >
                  <div
                    className="relative w-full max-w-5xl h-[78vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={selectedImage}
                      alt="project"
                      className="w-full h-full object-contain bg-black rounded-2xl shadow-2xl"
                    />
                    <button
                      onClick={() => {
                        setIsImageOpen(false);
                        setSelectedImage(null);
                      }}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition"
                    >
                      إغلاق ✖
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectionData.items.length ? (
                  sectionData.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(item.url);
                        setIsImageOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group text-right bg-white rounded-2xl shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_40px_rgba(30,45,62,0.14)] transition-all duration-300 overflow-hidden border border-[#e7ebf1] hover:border-[#D8CDBB] hover:-translate-y-1"
                      title={item.label}
                    >
                      <div className="relative h-40 bg-black">
                        <img
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                          src={item.url}
                          alt={item.label}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        <div className="absolute bottom-3 right-3 left-3 text-sm text-white font-bold line-clamp-1">
                          {item.label}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-4 rounded-2xl bg-[#f3f4f6] text-[#6b7280] text-center col-span-full">
                    لا توجد صور
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection !== "videos" && activeSection !== "images" && (
            <div className="mt-2">
              <div className="grid gap-3 md:grid-cols-2">
                {sectionData.items.length ? (
                  sectionData.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-[#1E2D3E]/4 hover:bg-[#D8CDBB] text-[#1E2D3E] border border-transparent hover:border-[#D8CDBB] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="text-right">
                        <div className="text-base font-bold">
                          {activeSection === "location"
                            ? "موقع المشروع"
                            : activeSection === "prices"
                            ? "عرض الأسعار"
                            : item.label}
                        </div>
                        <div className="text-xs text-[#6b7280] mt-1 group-hover:text-[#3d4d60]">
                          فتح الرابط في نافذة جديدة
                        </div>
                      </div>
                      <span className="text-2xl shrink-0" aria-hidden>
                        {iconFor(activeSection)}
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="py-4 rounded-2xl bg-[#f3f4f6] text-[#6b7280] text-center">
                    {activeSection === "pdfs"
                      ? "لا توجد ملفات"
                      : activeSection === "info"
                      ? "لا يوجد محتوى"
                      : activeSection === "location"
                      ? "لا يوجد روابط موقع"
                      : activeSection === "prices"
                      ? "لا توجد أسعار"
                      : "لا يوجد محتوى"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
