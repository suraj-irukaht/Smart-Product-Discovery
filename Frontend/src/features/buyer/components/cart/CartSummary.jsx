/**
 * CartSummary.jsx
 *
 * Sticky order summary panel.
 * Shows per-item breakdown, total, and place order button.
 * Navigates to /orders on success.
 *
 * Props:
 * - cart      : array of cart items (product_id populated)
 * - total     : number
 * - onPlace   : () => void
 * - ordering  : boolean
 */
import { Link } from "react-router-dom";

export default function CartSummary({ cart, total, onPlace, ordering }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
      <p className="text-sm font-bold text-slate-800 mb-4">Order Summary</p>

      {/* Item breakdown */}
      <div className="space-y-2 mb-4">
        {cart.map((item) => {
          const product = item.product_id;
          const price = Number(product?.price ?? 0);
          return (
            <div
              key={item._id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-500 truncate max-w-[180px]">
                {product?.name}
                <span className="text-slate-400 ml-1">×{item.quantity}</span>
              </span>
              <span className="font-medium text-slate-700 flex-shrink-0">
                ${(price * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-slate-100 mb-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-slate-900">Total</p>
        <p className="text-xl font-bold text-indigo-600">
          ${Number(total).toFixed(2)}
        </p>
      </div>

      {/* Place order */}
      <button
        onClick={onPlace}
        disabled={ordering}
        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm shadow-indigo-200"
      >
        {ordering ? (
          <span className="flex items-center justify-center gap-2">
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
            Placing Order...
          </span>
        ) : (
          "Place Order"
        )}
      </button>

      <Link
        to="/products"
        className="block text-center text-xs text-slate-400 hover:text-indigo-600 mt-3 transition-colors"
      >
        ← Continue Shopping
      </Link>
    </div>
  );
}
