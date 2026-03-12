/**
 * RelatedProducts.jsx
 *
 * Shows up to 4 products from the same category, excluding the current product.
 * Reuses ProductCard.
 *
 * Props:
 * - categoryId   : string
 * - excludeId    : string   current product _id
 * - cartItemIds  : Set<string>
 * - favoritedIds : Set<string>
 * - onAddToCart  : (productId) => Promise
 * - onToggleFav  : (productId) => void
 */
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/request";
import ProductCard from "@/components/ui/ProductCard";

const useRelated = (categoryId, excludeId) =>
  useQuery({
    queryKey: ["related", categoryId, excludeId],
    queryFn: () => get(`/products?category=${categoryId}&limit=5`),
    enabled: !!categoryId,
  });

export default function RelatedProducts({
  categoryId,
  excludeId,
  cartItemIds,
  favoritedIds,
  onAddToCart,
  onToggleFav,
}) {
  const { data, isLoading } = useRelated(categoryId, excludeId);

  const related = (data?.products ?? [])
    .filter((p) => String(p._id) !== String(excludeId))
    .slice(0, 4);

  if (!isLoading && related.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        Related Products
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-slate-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={() => onAddToCart(p._id)}
              isFavorited={favoritedIds?.has(String(p._id))}
              onToggleFav={() => onToggleFav(p._id)}
              isInCart={cartItemIds?.has(String(p._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
