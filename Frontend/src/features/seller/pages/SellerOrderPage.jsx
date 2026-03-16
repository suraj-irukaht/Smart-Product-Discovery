/**
 * SellerOrdersPage.jsx
 *
 * Read-only — sellers can VIEW orders containing their products.
 * Status updates are admin-only (multi-seller orders can't be
 * partially shipped by individual sellers).
 *
 * Route: /seller/orders
 * Layout: SellerLayout
 */

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetSellerOrders } from "@features/seller/hooks/useSellerProducts";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  User,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";

const STATUS_FILTERS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_STYLES = {
  PENDING: {
    bg: "bg-amber-100 text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",
  },
  CONFIRMED: {
    bg: "bg-blue-100  text-blue-700    dark:bg-blue-900/30    dark:text-blue-400",
  },
  PAID: {
    bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30  dark:text-indigo-400",
  },
  SHIPPED: {
    bg: "bg-violet-100 text-violet-700 dark:bg-violet-900/30  dark:text-violet-400",
  },
  DELIVERED: {
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  CANCELLED: {
    bg: "bg-red-100   text-red-700     dark:bg-red-900/30     dark:text-red-400",
  },
};

export default function SellerOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const statusFilter = searchParams.get("status") || "ALL";

  const params = {
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  const { data, isLoading } = useGetSellerOrders(params);

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const setFilter = (s) => {
    const next = new URLSearchParams(searchParams);
    if (s === "ALL") next.delete("status");
    else next.set("status", s);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${total} order${total !== 1 ? "s" : ""} containing your products`}
            </p>
          </div>
        </div>

        {/* ── Status filter tabs ───────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── Loading skeletons ────────────────────────── */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────── */}
        {!isLoading && orders.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
                <Package className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Orders containing your products will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Orders list ─────────────────────────────── */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((orderData) => (
              <OrderCard key={orderData.order._id} orderData={orderData} />
            ))}
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

/* ── Order card ─────────────────────────────────────────────── */
function OrderCard({ orderData }) {
  const { order, items } = orderData;
  const style = STATUS_STYLES[order.status] ?? {
    bg: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="border hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 space-y-3">
        {/* Row 1: Order ID + status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono font-bold text-foreground">
              {order._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${style.bg}`}
          >
            {order.status}
          </span>
        </div>

        {/* Row 2: Buyer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {order.user_id?.name ?? "Unknown buyer"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {order.user_id?.email ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Row 3: My items in this order */}
        {items?.length > 0 && (
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Your items in this order
            </p>
            {items.map((item) => (
              <div key={item.product_id} className="flex items-center gap-3">
                {item.mainImage ? (
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-9 h-9 rounded-lg object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    qty {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>
                <p className="text-xs font-semibold text-foreground shrink-0">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Read-only notice */}
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground italic">
            Status is managed by admin
          </p>
          <p className="text-sm font-bold text-foreground">
            ${Number(order.total_amount).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
