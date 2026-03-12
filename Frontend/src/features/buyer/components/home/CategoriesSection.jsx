/**
 * CategoriesSection.jsx
 *
 * Horizontal scrollable row of category pills.
 * Clicking a category navigates to /products?category=id.
 *
 * Props: none (fetches categories internally)
 */
import { Link } from "react-router-dom";
import useCategories from "@/features/categories/hooks/useCategory";
import SectionHeader from "./SectionHeader";

const CATEGORY_ICONS = [
  "📱",
  "💻",
  "👟",
  "🎧",
  "📷",
  "🏠",
  "📦",
  "🎮",
  "⌚",
  "👗",
];

export default function CategoriesSection() {
  const { data } = useCategories();
  const categories = data?.categories ?? [];

  if (!categories.length) return null;

  return (
    <section>
      <SectionHeader
        title="Browse Categories"
        subtitle="Shop by what you love"
        link="/products"
        linkLabel="All Products"
      />
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((c, i) => (
          <Link
            key={c._id}
            to={`/products?category=${c._id}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group min-w-[90px]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl group-hover:bg-indigo-100 transition-colors">
              {CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
            </div>
            <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
