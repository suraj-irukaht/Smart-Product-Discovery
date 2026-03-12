/**
 * OrderCard.jsx
 *
 * Single order card showing:
 * - Order ID, date, status badge
 * - Total amount
 * - Cancel button (only when status is PENDING)
 *
 * Props:
 * - order       : order object { _id, total_amount, status, createdAt }
 * - onCancel    : (orderId) => void
 * - cancelling  : boolean — true while this order's cancel is in flight
 */
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ order, onCancel, cancelling }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shortId = String(order._id).slice(-8).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Top row: ID + date + status */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Order</p>
          <p className="text-sm font-bold text-slate-800 font-mono tracking-wide">
            #{shortId}
          </p>
          <p className="text-xs text-slate-400 mt-1">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="h-px bg-slate-100 my-4" />

      {/* Bottom row: total + cancel */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Total Amount</p>
          <p className="text-lg font-bold text-indigo-600">
            ${Number(order.total_amount).toFixed(2)}
          </p>
        </div>

        {order.status === "PENDING" && (
          <button
            onClick={() => onCancel(order._id)}
            disabled={cancelling}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {cancelling ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
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
                Cancelling...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                Cancel Order
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
