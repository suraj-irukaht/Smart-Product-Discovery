import { useSearchParams } from "react-router-dom";
import { useAllOrders, useUpdateOrderStatus } from "@features/admin";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, User, Calendar, DollarSign, Hash } from "lucide-react";

// ── Status config ────────────────────────────────────────────
const STATUS_VARIANT = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PAID: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const ALLOWED_TRANSITIONS = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const TERMINAL = ["DELIVERED", "CANCELLED"];

export default function AdminManageOrderPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;

  const { data, isLoading } = useAllOrders(page, limit);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data?.total ?? 0} total orders
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <Separator />

        {/* ── Loading skeletons ────────────────────────── */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-3 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────── */}
        {!isLoading && orders.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground">
                Orders will appear here once buyers check out.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Order Cards ─────────────────────────────── */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isPending={isPending}
                onStatusChange={(status) =>
                  updateStatus({ orderId: order._id, status })
                }
              />
            ))}
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

// ── Single order card ────────────────────────────────────────
function OrderCard({ order, isPending, onStatusChange }) {
  const isTerminal = TERMINAL.includes(order.status);
  const nextOptions = ALLOWED_TRANSITIONS.filter((s) => s !== order.status);

  return (
    <Card className="border hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        {/* Row 1: Order ID + Status badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs font-semibold text-muted-foreground tracking-wider">
              {order._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              STATUS_VARIANT[order.status] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Row 2: Meta info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {order.user_id?.name ?? "—"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {order.user_id?.email ?? ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                ${Number(order.total_amount).toFixed(2)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {order.items?.length ?? 0} item
                {order.items?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Row 3: Action */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Update status</p>

          {isTerminal ? (
            <span className="text-xs text-muted-foreground italic">
              No further actions
            </span>
          ) : (
            <Select
              value={order.status}
              disabled={isPending}
              onValueChange={onStatusChange}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {ALLOWED_TRANSITIONS.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
