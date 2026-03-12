/**
 * ProductsGrid.jsx
 *
 * Renders product grid with loading skeleton and empty state.
 * Pagination is rendered below the grid.
 *
 * Props:
 * - products      : array
 * - isLoading     : boolean
 * - total         : number
 * - totalPages    : number
 * - cartItemIds   : Set<string>
 * - favoritedIds  : Set<string>
 * - onAddToCart   : (productId) => void
 * - onToggleFav   : (productId) => void
 * - onReset       : () => void
 */
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";

export default function ProductsGrid({
  products,
  isLoading,
  total,
  totalPages,
  cartItemIds,
  favoritedIds,
  onAddToCart,
  onToggleFav,
  onReset,
}) {
  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-slate-100" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-slate-100 rounded-full w-3/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              <div className="h-8 bg-slate-100 rounded-xl mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* Empty */
  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
        <p className="text-5xl mb-4">🔍</p>
        <p className="font-bold text-slate-700 text-lg mb-1">
          No products found
        </p>
        <p className="text-sm text-slate-400 mb-5">
          Try adjusting your filters
        </p>
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 cursor-pointer transition-colors"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  /* Grid */
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={() => onAddToCart(p._id)}
            isFavorited={favoritedIds.has(String(p._id))}
            onToggleFav={() => onToggleFav(p._id)}
            isInCart={cartItemIds.has(String(p._id))}
          />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
}
