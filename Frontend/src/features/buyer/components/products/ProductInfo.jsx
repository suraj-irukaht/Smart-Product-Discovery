/**
 * ProductInfo.jsx
 *
 * Product name, brand, category, price, stock, add to cart / in cart.
 *
 * Props:
 * - product      : product object
 * - isInCart     : boolean
 * - isFavorited  : boolean
 * - onAddToCart  : () => Promise
 * - onToggleFav  : () => void
 */
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductInfo({
  product,
  isInCart,
  isFavorited,
  onAddToCart,
  onToggleFav,
}) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (loading || isInCart || product.stock === 0) return;
    setLoading(true);
    try {
      await onAddToCart();
    } finally {
      setLoading(false);
    }
  };

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  return (
    <div className="space-y-5">
      {/* Category + favourite */}
      <div className="flex items-center justify-between">
        {product.category?.name && (
          <Link
            to={`/products?category=${product.category._id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors capitalize"
          >
            {product.category.name}
          </Link>
        )}
        <button
          onClick={onToggleFav}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
        >
          {isFavorited ? (
            <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              fill="none"
              strokeWidth={1.8}
              stroke="#94a3b8"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Name */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {product.name}
        </h1>
        {product.brand && (
          <p className="text-sm text-slate-400 mt-1">by {product.brand}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-indigo-600">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>

      {/* Stock */}
      <div>
        {!inStock && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-semibold border border-red-200">
            Out of Stock
          </span>
        )}
        {lowStock && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-200">
            ⚠️ Only {product.stock} left
          </span>
        )}
        {inStock && !lowStock && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
            ✓ In Stock ({product.stock} available)
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Description
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      <div className="h-px bg-slate-100" />

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={loading || isInCart || !inStock}
        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
          !inStock
            ? "bg-slate-100 text-slate-300 cursor-not-allowed"
            : isInCart
              ? "bg-emerald-500 text-white cursor-not-allowed"
              : loading
                ? "bg-indigo-400 text-white cursor-wait"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200 active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Adding...
          </>
        ) : isInCart ? (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Already in Cart
          </>
        ) : !inStock ? (
          "Out of Stock"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25z" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
