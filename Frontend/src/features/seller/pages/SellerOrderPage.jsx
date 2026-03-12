/**
 * SellerOrdersPage.jsx
 *
 * Seller orders page — shows all orders containing seller's products.
 * Seller can update order status to SHIPPED or DELIVERED.
 *
 * Route: /seller/orders
 * Layout: SellerLayout
 */
import { useState } from "react";
import {
  useGetSellerOrders,
  useUpdateSellerOrderStatus,
} from "@features/seller/hooks/useSellerProducts";
import SellerOrderCard from "@features/seller/components/SellerOrderCard";
import Pagination from "@/components/ui/Pagination";
import { PAGINATION } from "@/config/config.pagination";

const STATUS_FILTERS = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function SellerOrdersPage() {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [statusFilter, setStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);
  const limit = PAGINATION.DEFAULT_LIMIT;

  const params = {
    page,
    limit,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  const { data, isLoading } = useGetSellerOrders(params);
  const { mutate: updateStatus, isPending } = useUpdateSellerOrderStatus();

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleUpdate = ({ orderId, status }) => {
    setUpdatingId(orderId);
    updateStatus(
      { orderId, status },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isLoading
              ? "Loading..."
              : `${total} order${total !== 1 ? "s" : ""} for your products`}
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                statusFilter === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="px-5 py-4 bg-slate-50 h-16" />
                <div className="px-5 py-4 space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-slate-100 h-14" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 py-24 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-bold text-slate-700 text-lg mb-1">
              No orders yet
            </p>
            <p className="text-sm text-slate-400">
              Orders for your products will appear here
            </p>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && orders.length > 0 && (
          <>
            <div className="space-y-4 mb-8">
              {orders.map((orderData) => (
                <SellerOrderCard
                  key={orderData.order._id}
                  orderData={orderData}
                  onUpdate={handleUpdate}
                  updating={updatingId === orderData.order._id}
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
