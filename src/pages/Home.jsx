import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  // سلايدرز للواجهة الرئيسية (بدّل الصور لاحقًا من public/assets/hero)
  const slides = useMemo(
    () => [
      "/assets/hero/slide1.jpeg",
      "/assets/hero/slide2.jpeg",
      "/assets/hero/slide3.jpeg",
      "/assets/hero/slide4.jpeg",
      "/assets/hero/slide5.jpeg",
      "/assets/hero/slide6.jpeg",
      "/assets/hero/slide7.jpeg",
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen pt-24 px-4">
      {/* خلفية خفيفة بنفس روح راكز */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(30,45,62,0.06),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(174,165,151,0.10),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(30,45,62,0.08),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(#1E2D3E_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="max-w-6xl mx-auto">
        {/* القسم اليسار (زي ما هو) – سلايدر الصور */}
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
          <div className="relative min-h-[520px]">
            <div className="absolute inset-0">
              <>
              {/* خلفية مموّهة للحفاظ على توازن المقاس بدون قص */}
              <img
                src={slides[active]}
                alt="Rakez Slide Background"
                className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-35"
              />
              {/* الصورة الأساسية بدون قص */}
              <img
                src={slides[active]}
                alt="Rakez Slide"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </>
              {/* Overlay لرفع التباين */}
              <div className="absolute inset-0 bg-gradient-to-l from-primary/45 via-primary/20 to-transparent" />
            </div>

            {/* شريط علوي صغير: لوجو + اسم الشركة */}
            <div className="absolute top-4 left-4 flex items-center gap-3 rounded-2xl bg-white/85 backdrop-blur px-3 py-2 border border-black/10 shadow-sm">
              <img
                src="/assets/logo/logo.png"
                alt="RAKEZ"
                className="h-8 w-auto object-contain"
              />
              <div className="leading-tight">
                <div className="text-sm font-extrabold text-primary">راكز العقارية</div>
                <div className="text-[11px] font-semibold text-secondary">Team Portal</div>
              </div>
            </div>

            {/* زر المشاريع */}
            <div className="absolute bottom-5 right-5">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary text-white px-5 py-3 font-bold shadow-lg hover:bg-primary/90 transition"
              >
               
                <span className="inline-block h-2 w-2 rounded-full bg-secondary" />
              </Link>
            </div>

            {/* نقاط السلايدر */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition border ${
                    i === active
                      ? "w-10 bg-secondary border-secondary"
                      : "w-2.5 bg-secondary/40 border-secondary/60 hover:bg-secondary/60"
                  }`}
                  aria-label={`slide ${i + 1}`}
                />
              ))}
            </div>

            {/* حركة دخول بسيطة */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
