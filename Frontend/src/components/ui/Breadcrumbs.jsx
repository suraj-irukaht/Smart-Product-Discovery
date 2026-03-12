import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="flex items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="hover:text-blue-600 transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}

            {i !== items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
