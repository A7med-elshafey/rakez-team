export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ELshafey
      </div>
    </footer>
  );
}
