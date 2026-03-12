/**
 * OrdersPage.jsx
 *
 * Buyer order history page.
 * Lists all orders with status, total, and cancel option.
 * Cancel is only available for PENDING orders.
 *
 * Route: /orders
 * Layout: BuyerLayout
 * Depends on: useGetOrders, useCancelOrder
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetOrders, useCancelOrder } from "../features/buyer/hooks/useOrder";
import OrderCard from "@features/buyer/components/orders/OrderCard";
import OrdersSkeleton from "@features/buyer/components/orders/OrdersSkeleton";
import Pagination from "@/components/ui/Pagination";
import { PAGINATION } from "@/config/config.pagination";

export default function OrdersPage() {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const limit = PAGINATION.DEFAULT_LIMIT;

  const { data, isLoading } = useGetOrders({ page, limit });
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  // track which orderId is being cancelled
  const [cancellingId, setCancellingId] = useState(null);

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleCancel = (orderId) => {
    setCancellingId(orderId);
    cancelOrder(orderId, {
      onSettled: () => setCancellingId(null),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your orders
          </p>
        </div>

        {/* Loading */}
        {isLoading && <OrdersSkeleton />}

        {/* Empty */}
        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 py-24 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-bold text-slate-700 text-lg mb-1">
              No orders yet
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Your order history will appear here
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && orders.length > 0 && (
          <>
            {/* Status legend */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                <span
                  key={s}
                  className="text-xs text-slate-400 flex items-center gap-1"
                >
                  <StatusDot status={s} />
                  {s}
                </span>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onCancel={handleCancel}
                  cancelling={cancellingId === order._id}
                />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = {
    PENDING: "bg-amber-400",
    SHIPPED: "bg-blue-400",
    DELIVERED: "bg-emerald-400",
    CANCELLED: "bg-red-400",
  };
  return (
    <span
      className={`w-2 h-2 rounded-full inline-block ${colors[status] ?? "bg-slate-300"}`}
    />
  );
}
