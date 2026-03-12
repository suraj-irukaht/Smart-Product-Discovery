/**
 * ProductSection.jsx
 *
 * Reusable product grid section used on the homepage.
 * Shows up to `limit` products in a responsive grid.
 * "View all" link in the header navigates to /products.
 *
 * Props:
 * - title        : string
 * - subtitle     : string (optional)
 * - products     : array
 * - viewAllLink  : string (optional)
 * - onAddToCart  : (productId) => void
 * - adding       : boolean
 * - favoritedIds : Set<string>
 * - onToggleFav  : (productId) => void
 * - limit        : number (default 8)
 */
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "./SectionHeader";

export default function ProductSection({
  title,
  subtitle,
  products = [],
  viewAllLink,
  onAddToCart,
  adding,
  favoritedIds,
  onToggleFav,
  limit = 8,
}) {
  const visible = products.filter(Boolean).slice(0, limit);

  if (!visible.length) return null;

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} link={viewAllLink} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={() => onAddToCart(p._id)}
            adding={adding}
            isFavorited={favoritedIds?.has(String(p._id))}
            onToggleFav={() => onToggleFav(p._id)}
          />
        ))}
      </div>
    </section>
  );
}
