/**
 * SellerDashboard.jsx
 *
 * Main dashboard page for authenticated sellers.
 * Displays key stats, recent products preview, and profile modal trigger.
 * Navbar and sidebar are handled by SellerLayout — not duplicated here.
 *
 * Route: /seller
 * Layout: SellerLayout (sidebar)
 * Depends on: useGetMyProducts, useAuthStore, ProfileModal
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyProducts } from "../hooks/useSellerProducts";
import { useAuthStore } from "@/store/authStore";
import ProfileModal from "@features/seller/components/ProfileModal";

const STATS_CONFIG = [
  {
    key: "products",
    label: "Products",
    emoji: "📦",
    iconBg: "bg-indigo-50",
    bar: "bg-indigo-500",
  },
  {
    key: "stock",
    label: "Total Stock",
    emoji: "🏷️",
    iconBg: "bg-sky-50",
    bar: "bg-sky-500",
  },
  {
    key: "outOfStock",
    label: "Out of Stock",
    emoji: "⚠️",
    iconBg: "bg-rose-50",
    bar: "bg-rose-500",
  },
  {
    key: "avgPrice",
    label: "Avg Price",
    emoji: "💰",
    iconBg: "bg-emerald-50",
    bar: "bg-emerald-500",
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
    products: isLoading ? "—" : (data?.total ?? products.length),
    stock: isLoading ? "—" : totalStock,
    outOfStock: isLoading ? "—" : outOfStock,
    avgPrice: isLoading ? "—" : `$${avgPrice}`,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Hero Banner ─────────────────────────── */}
        <div className="rounded-2xl bg-indigo-600 px-6 sm:px-8 py-6 sm:py-7 mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
          <div className="absolute bottom-[-20px] right-24 w-32 h-32 rounded-full bg-white opacity-5" />
          <div className="absolute top-4 right-44 w-16 h-16 rounded-full bg-white opacity-5" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-2">
                Welcome back
              </p>
              <h1 className="text-white text-xl sm:text-2xl font-bold mb-1 tracking-tight">
                {user?.name} 👋
              </h1>
              <p className="text-indigo-200 text-sm">
                {user?.shopName
                  ? `Managing · ${user.shopName}`
                  : "Here's what's happening with your store today"}
              </p>
            </div>

            {/* Edit Profile button */}
            <button
              onClick={() => setProfileOpen(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/20"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS_CONFIG.map((s) => (
            <div
              key={s.key}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${s.iconBg}`}
              >
                {s.emoji}
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                {statValues[s.key]}
              </p>
              <p className="text-xs text-slate-400 font-medium mb-3">
                {s.label}
              </p>
              <div className="h-1 rounded-full bg-slate-100">
                <div className={`h-full w-3/5 rounded-full ${s.bar}`} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Products ─────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900">Recent Products</p>
            <Link
              to="/seller/products"
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading...
            </div>
          )}

          {/* Empty */}
          {!isLoading && products.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-slate-400 text-sm font-medium mb-3">
                No products yet
              </p>
              <Link
                to="/products/seller/create"
                className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Add your first product
              </Link>
            </div>
          )}

          {/* Product rows */}
          {!isLoading &&
            products.length > 0 &&
            products.slice(0, 6).map((p, i) => (
              <div
                key={p._id}
                className={`flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-slate-50 transition-colors gap-3 ${
                  i < Math.min(products.length, 6) - 1
                    ? "border-b border-slate-50"
                    : ""
                }`}
              >
                {/* Left: image + name */}
                <div className="flex items-center gap-3 min-w-0">
                  {p.main_image || p.mainImage ? (
                    <img
                      src={p.main_image || p.mainImage}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                      📦
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Stock:{" "}
                      <span
                        className={
                          p.stock === 0
                            ? "text-red-500 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {p.stock === 0 ? "Out of stock" : p.stock}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right: price + status */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">
                    ${Number(p.price).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Profile Modal ───────────────────────── */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
