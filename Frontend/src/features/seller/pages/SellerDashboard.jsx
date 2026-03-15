/**
 * SellerDashboard.jsx
 * Route: /seller
 * Layout: SellerLayout (sidebar)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyProducts } from "../hooks/useSellerProducts";
import { useAuthStore } from "@/store/authStore";
import ProfileModal from "@features/seller/components/ProfileModal";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Tags,
  AlertTriangle,
  DollarSign,
  Pencil,
  ArrowRight,
  TrendingUp,
  Store,
} from "lucide-react";

// ── Stat card config ─────────────────────────────────────────
const STATS_CONFIG = [
  {
    key: "products",
    label: "Total Products",
    icon: Package,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950",
    bar: "bg-indigo-500",
  },
  {
    key: "stock",
    label: "Total Stock",
    icon: Tags,
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950",
    bar: "bg-sky-500",
  },
  {
    key: "outOfStock",
    label: "Out of Stock",
    icon: AlertTriangle,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950",
    bar: "bg-rose-500",
    alert: true,
  },
  {
    key: "avgPrice",
    label: "Avg Price",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    bar: "bg-emerald-500",
    isMoney: true,
  },
];

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading } = useGetMyProducts();
  const [profileOpen, setProfileOpen] = useState(false);

  const products = data?.products ?? [];
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const avgPrice = products.length
    ? (
        products.reduce((sum, p) => sum + Number(p.price || 0), 0) /
        products.length
      ).toFixed(2)
    : "0.00";

  const statValues = {
    products: isLoading ? null : (data?.total ?? products.length),
    stock: isLoading ? null : totalStock,
    outOfStock: isLoading ? null : outOfStock,
    avgPrice: isLoading ? null : Number(avgPrice),
  };

  // For the progress bar — normalise against the biggest value
  const maxStock = Math.max(totalStock, 1);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 px-6 py-6 overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-[-16px] right-24 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute top-4 right-48 w-12 h-12 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-indigo-300" />
                <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase">
                  Seller Dashboard
                </p>
              </div>
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight mb-1">
                Welcome back, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-indigo-200 text-sm">
                {user?.shopName
                  ? `Managing · ${user.shopName}`
                  : "Here's what's happening with your store today"}
              </p>
            </div>

            <Button
              onClick={() => setProfileOpen(true)}
              variant="outline"
              size="sm"
              className="shrink-0 bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS_CONFIG.map(
            ({ key, label, icon: Icon, color, bg, bar, alert, isMoney }) => (
              <Card
                key={key}
                className={`border hover:shadow-md transition-shadow ${
                  alert && statValues.outOfStock > 0
                    ? "border-rose-200 dark:border-rose-900"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg}`}
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>

                  {/* Value */}
                  {isLoading ? (
                    <div className="h-7 w-2/3 bg-muted rounded animate-pulse mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground tracking-tight leading-tight mb-0.5">
                      {isMoney ? `$${statValues[key]}` : statValues[key]}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground font-medium mb-3">
                    {label}
                  </p>

                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-muted">
                    {!isLoading && (
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${bar}`}
                        style={{
                          width:
                            key === "outOfStock"
                              ? `${Math.min((statValues.outOfStock / Math.max(statValues.products, 1)) * 100, 100)}%`
                              : key === "products"
                                ? "60%"
                                : key === "avgPrice"
                                  ? "50%"
                                  : `${Math.min((totalStock / maxStock) * 100, 100)}%`,
                        }}
                      />
                    )}
                  </div>

                  {/* Alert badge for out of stock */}
                  {alert && !isLoading && statValues.outOfStock > 0 && (
                    <p className="text-[10px] text-rose-500 font-medium mt-2">
                      Needs attention
                    </p>
                  )}
                </CardContent>
              </Card>
            ),
          )}
        </div>

        <Separator />

        {/* ── Recent Products ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Recent Products
              </h2>
            </div>
            <Link
              to="/seller/products"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/4 bg-muted rounded" />
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-3.5 w-14 bg-muted rounded" />
                      <div className="h-3 w-12 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && products.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                  <Package className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground text-sm">
                    No products yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add your first product to get started
                  </p>
                </div>
                <Button asChild size="sm" className="mt-1">
                  <Link to="/products/seller/create">Add Product</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Product list */}
          {!isLoading && products.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {products.slice(0, 6).map((p) => (
                <Card key={p._id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    {/* Thumbnail */}
                    {p.main_image || p.mainImage ? (
                      <img
                        src={p.main_image || p.mainImage}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}

                    {/* Name + stock */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Tags className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Stock:{" "}
                          <span
                            className={
                              p.stock === 0 ? "text-rose-500 font-semibold" : ""
                            }
                          >
                            {p.stock === 0 ? "Out of stock" : p.stock}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price + status */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        ${Number(p.price).toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
