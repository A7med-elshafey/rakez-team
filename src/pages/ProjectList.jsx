import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Home, Building, Layers } from "lucide-react";

function ProjectCategory({ icon: Icon, title, path }) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition w-full sm:w-[45%] lg:w-[22%]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/projects/${path}`} className="block group">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-7 h-7 text-green-700 transition group-hover:scale-110" />
          <h2 className="text-xl font-bold text-green-800">{title}</h2>
        </div>

        <div className="block bg-green-100 rounded-xl p-3 shadow-sm hover:bg-green-300 transition text-center font-medium text-green-700">
          عرض المشاريع
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div className="relative min-h-screen px-8 py-20 bg-gradient-to-b from-green-50 to-green-100">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-extrabold text-center text-green-800 mb-12 tracking-wide"
      >
        مشاريع الخارطة
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-6">
        <ProjectCategory icon={Home} title="الشقق" path="apartments" />
        <ProjectCategory icon={Building2} title="الأبراج" path="towers" />
        <ProjectCategory icon={Building} title="الفلل" path="villas" />
        <ProjectCategory icon={Layers} title="الأدوار" path="floors" />
      </div>
    </div>
  );
}
