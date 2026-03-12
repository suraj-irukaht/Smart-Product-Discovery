/**
 * OrderStatusBadge.jsx
 *
 * Colored pill badge for order status.
 * Statuses: PENDING, SHIPPED, DELIVERED, CANCELLED
 *
 * Props:
 * - status : string
 */
const STATUS_STYLES = {
  PENDING: "bg-amber-50   text-amber-600  border-amber-200",
  SHIPPED: "bg-blue-50    text-blue-600   border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-red-50     text-red-500    border-red-200",
};

const STATUS_ICONS = {
  PENDING: "🕐",
  SHIPPED: "🚚",
  DELIVERED: "✅",
  CANCELLED: "✕",
};

export default function OrderStatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] ?? "bg-slate-50 text-slate-500 border-slate-200";
  const icon = STATUS_ICONS[status] ?? "•";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      <span>{icon}</span>
      {status}
    </span>
  );
}
