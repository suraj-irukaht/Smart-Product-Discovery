/**
 * ProductSection.jsx
 * Reusable product grid section for homepage.
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
  cartItemIds,
  isLoading,
  limit = 8,
}) {
  const visible = products.filter(Boolean).slice(0, limit);

  if (!isLoading && !visible.length) return null;

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} link={viewAllLink} />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visible.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={() => onAddToCart(p._id)}
              adding={adding}
              isFavorited={favoritedIds?.has(String(p._id))}
              onToggleFav={() => onToggleFav(p._id)}
              isInCart={cartItemIds?.has(String(p._id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
