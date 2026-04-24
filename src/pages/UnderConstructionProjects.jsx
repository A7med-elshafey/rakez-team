import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function UnderConstructionProjects() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then((list) => {
        const filtered = list.filter(
          (p) =>
            p.category?.label === category && p.status === "under-construction"
        );
        setItems(filtered);
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p className="p-8">جار التحميل...</p>;

  return (
    <div className="pt-24 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-right">
        {category} — تحت الإنشاء
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.category.key}/${p.id}/pdfs`} // ✅ صححنا المسار
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
          >
            <img
              src={p.cover}
              alt={p.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-3 text-right">
              <div className="font-semibold text-green-800">{p.name}</div>
              <div className="text-sm text-gray-500">{p.category?.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

