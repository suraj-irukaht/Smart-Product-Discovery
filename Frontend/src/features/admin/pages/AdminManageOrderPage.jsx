import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAllOrders, useUpdateOrderStatus } from "@features/admin";
import Pagination from "@/components/ui/Pagination";
import { PAGINATION } from "@/config/config.pagination";

const STATUS_COLORS = {
  PENDING: { bg: "#fef9c3", text: "#854d0e" },
  CONFIRMED: { bg: "#dbeafe", text: "#1e40af" },
  PAID: { bg: "#d1fae5", text: "#065f46" },
  SHIPPED: { bg: "#ede9fe", text: "#5b21b6" },
  DELIVERED: { bg: "#dcfce7", text: "#15803d" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
};

const ALLOWED_TRANSITIONS = ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminManageOrderPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;

  const { data, isLoading } = useAllOrders(page, limit);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleStatusChange = (orderId, status) => {
    updateStatus({ orderId, status });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            Manage Orders
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {data?.total ?? 0} total orders
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <svg
              className="animate-spin h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "var(--color-primary)" }}
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
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}

        {/* Empty */}
        {!isLoading && orders.length === 0 && (
          <div
            className="text-center py-20 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-4xl mb-3">🛒</p>
            <p
              className="font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              No orders yet
            </p>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && orders.length > 0 && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-muted)",
                  }}
                >
                  {[
                    "Order ID",
                    "Buyer",
                    "Amount",
                    "Date",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom:
                        i < orders.length - 1
                          ? "1px solid var(--color-border)"
                          : "none",
                    }}
                  >
                    {/* Order ID */}
                    <td
                      className="px-4 py-3 font-mono text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Buyer */}
                    <td className="px-4 py-3">
                      <p
                        className="font-medium"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {order.user_id?.name ?? "—"}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {order.user_id?.email ?? ""}
                      </p>
                    </td>

                    {/* Amount */}
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      ${Number(order.total_amount).toFixed(2)}
                    </td>

                    {/* Date */}
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[order.status]?.bg ?? "#f3f4f6",
                          color: STATUS_COLORS[order.status]?.text ?? "#374151",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3">
                      {order.status === "CANCELLED" ||
                      order.status === "DELIVERED" ? (
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          No actions
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="rounded-lg border px-2 py-1 text-xs outline-none"
                          style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-background)",
                            color: "var(--color-foreground)",
                          }}
                        >
                          <option value={order.status} disabled>
                            {order.status}
                          </option>
                          {ALLOWED_TRANSITIONS.filter(
                            (s) => s !== order.status,
                          ).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
