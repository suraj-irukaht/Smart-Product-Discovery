/**
 * CartItem.jsx
 *
 * Single cart item row.
 * Shows image, name, brand, price, quantity controls, subtotal, remove button.
 * Quantity update calls PATCH /cart/:productId with optimistic local state.
 *
 * Props:
 * - item     : cart item object (product_id populated)
 * - onUpdate : ({ productId, quantity }) => Promise
 * - onRemove : (productId) => void
 */
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CartItem({ item, onUpdate, onRemove }) {
  const product = item.product_id;
  const image =
    product?.mainImage || product?.main_image || product?.image_url?.[0];
  const price = Number(product?.price ?? 0);
  const stock = product?.stock ?? 0;

  const [qty, setQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const handleQtyChange = async (newQty) => {
    if (newQty < 1 || newQty > stock || loading) return;
    setQty(newQty);
    setLoading(true);
    try {
      await onUpdate({ productId: product._id, quantity: newQty });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
      {/* Image */}
      <Link to={`/products/${product?._id}`} className="flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={product?.name}
            className="w-20 h-20 rounded-xl object-cover border border-slate-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
            📦
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product?._id}`}>
          <p className="text-sm font-semibold text-slate-800 truncate hover:text-indigo-600 transition-colors">
            {product?.name}
          </p>
        </Link>
        {product?.brand && (
          <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>
        )}
        <p className="text-sm font-bold text-indigo-600 mt-1">
          ${price.toFixed(2)}
        </p>
        {stock <= 5 && stock > 0 && (
          <p className="text-xs text-amber-500 font-medium mt-0.5">
            Only {stock} left
          </p>
        )}
      </div>

      {/* Right: subtotal + qty + remove */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        {/* Subtotal */}
        <p className="text-sm font-bold text-slate-900">
          ${(price * qty).toFixed(2)}
        </p>

        {/* Qty controls */}
        <div className="flex items-center gap-1 bg-slate-50 rounded-xl border border-slate-200 p-0.5">
          <button
            onClick={() => handleQtyChange(qty - 1)}
            disabled={qty <= 1 || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold text-lg leading-none"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-bold text-slate-800">
            {loading ? (
              <svg
                className="w-3 h-3 animate-spin mx-auto"
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
            ) : (
              qty
            )}
          </span>
          <button
            onClick={() => handleQtyChange(qty + 1)}
            disabled={qty >= stock || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold text-lg leading-none"
          >
            +
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(product._id)}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
