/**
 * FavoritesGrid.jsx
 *
 * Grid of favorited products with remove + add to cart.
 * Shows empty state if no favorites.
 *
 * Props:
 * - favorites    : array of favorite objects (product_id populated)
 * - cartItemIds  : Set<string>
 * - onAddToCart  : (productId) => Promise
 * - onToggleFav  : (productId) => void
 */
import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";

export default function FavoritesGrid({
  favorites,
  cartItemIds,
  onAddToCart,
  onToggleFav,
}) {
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 py-24 text-center">
        <p className="text-5xl mb-4">🤍</p>
        <p className="font-bold text-slate-700 text-lg mb-1">
          No favorites yet
        </p>
        <p className="text-sm text-slate-400 mb-6">
          Browse products and heart the ones you love
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {favorites.map((fav) => {
        const product = fav.product_id;
        if (!product?._id) return null;
        return (
          <ProductCard
            key={fav._id}
            product={product}
            onAddToCart={() => onAddToCart(product._id)}
            isFavorited={true}
            onToggleFav={() => onToggleFav(product._id)}
            isInCart={cartItemIds.has(String(product._id))}
          />
        );
      })}
    </div>
  );
}
