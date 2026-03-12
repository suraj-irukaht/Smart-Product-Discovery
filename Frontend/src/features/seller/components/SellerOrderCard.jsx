/**
 * SellerOrderCard.jsx
 *
 * Shows a single order with the seller's items inside.
 * Seller can mark as SHIPPED or DELIVERED.
 *
 * Props:
 * - orderData  : { order, items }
 * - onUpdate   : ({ orderId, status }) => void
 * - updating   : boolean
 */
import OrderStatusBadge from "@features/buyer/components/orders/OrderStatusBadge";

const NEXT_STATUS = {
  PENDING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

export default function SellerOrderCard({ orderData, onUpdate, updating }) {
  const { order, items } = orderData;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const shortId = String(order._id).slice(-8).toUpperCase();
  const next = NEXT_STATUS[order.status];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-slate-400">Order</p>
            <p className="text-sm font-bold text-slate-800 font-mono">
              #{shortId}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Date</p>
            <p className="text-xs font-medium text-slate-600">{date}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Customer</p>
            <p className="text-xs font-medium text-slate-600">
              {order.user_id?.name ?? "—"}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-3">
        {items.map((item) => {
          const product = item.product_id;
          const image = product?.mainImage || product?.image_url?.[0];
          return (
            <div key={item._id} className="flex items-center gap-3">
              {image ? (
                <img
                  src={image}
                  alt={product?.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                  📦
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {product?.name ?? "Product"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Qty: {item.quantity} · ${Number(item.price).toFixed(2)} each
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900 flex-shrink-0">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer: total + action */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-400">Order Total</p>
          <p className="text-base font-bold text-indigo-600">
            ${Number(order.total_amount).toFixed(2)}
          </p>
        </div>

        {next && (
          <button
            onClick={() => onUpdate({ orderId: order._id, status: next })}
            disabled={updating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm shadow-indigo-200"
          >
            {updating ? (
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
                Updating...
              </>
            ) : (
              <>
                {next === "SHIPPED" && "🚚 Mark as Shipped"}
                {next === "DELIVERED" && "✅ Mark as Delivered"}
              </>
            )}
          </button>
        )}

        {order.status === "DELIVERED" && (
          <span className="text-xs text-emerald-600 font-semibold">
            ✅ Completed
          </span>
        )}
        {order.status === "CANCELLED" && (
          <span className="text-xs text-red-500 font-semibold">
            ✕ Cancelled by buyer
          </span>
        )}
      </div>
    </div>
  );
}
