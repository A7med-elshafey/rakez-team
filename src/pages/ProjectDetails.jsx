import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject } from "../services/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    getProject(id).then(setProject).catch(() => setProject(undefined));
  }, [id]);

  if (project === undefined) return <p className="p-8">تعذر تحميل المشروع</p>;
  if (!project) return <p className="p-8">جار التحميل...</p>;

  const S = project.sections || {};
  const counts = {
    pdfs: S.pdfs?.items?.length || 0,
    videos: S.videos?.items?.length || 0,
    images: (S.images?.items?.length || S.gallery?.items?.length || S.photos?.items?.length || 0),
    info: S.info?.items?.length || 0,
    location: S.location?.items?.length || 0,
    prices: S.prices?.items?.length || 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="rounded-2xl overflow-hidden shadow bg-white">
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-72 object-cover"
        />
        <div className="p-6 text-right">
          <div className="text-primary text-sm">{project.category?.label}</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-3 justify-end">
            <Link
              to={`/projects/${project.category?.key}/${project.id}/videos`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              الفيديوهات ({counts.videos})
            </Link>
            <Link
              to={`/projects/${project.category?.key}/${project.id}/images`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              الصور ({counts.images})
            </Link>
            <Link
              to={`/projects/${project.category?.key}/${project.id}/pdfs`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              ملفات PDF ({counts.pdfs})
            </Link>
            <Link
              to={`/projects/${project.category?.key}/${project.id}/info`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              معلومات إضافية ({counts.info})
            </Link>
            <Link
              to={`/projects/${project.category?.key}/${project.id}/location`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              الموقع ({counts.location})
            </Link>
            <Link
              to={`/projects/${project.category?.key}/${project.id}/prices`}
              className="px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary"
            >
              قائمة الأسعار ({counts.prices})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
