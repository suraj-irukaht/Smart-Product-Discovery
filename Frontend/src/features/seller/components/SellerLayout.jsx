/**
 * SellerLayout.jsx
 *
 * Persistent sidebar layout wrapper for all seller pages.
 * Renders navigation links with active state, logout button, and seller info.
 * On mobile, sidebar is hidden and toggled via a hamburger button.
 * Wrap all seller routes with this via <Outlet />.
 *
 * Used in: AppRoutes.jsx (seller route group)
 * Depends on: useLogout, useAuthStore, NavLink
 */

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "@features/auth";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { to: "/seller", label: "Dashboard", icon: "📊", end: true },
  { to: "/seller/products", label: "Products", icon: "📦" },
  { to: "/products/seller/create", label: "Add Product", icon: "➕" },
  { to: "/seller/orders", label: "Orders", icon: "🛒" },
];

export default function SellerLayout() {
  const { handleLogout } = useLogout();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "S";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Mobile overlay ────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────── */}
      <aside
        className={`
        fixed top-0 left-0 h-dvh z-30 flex flex-col w-60
        bg-white border-r border-slate-200
        transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto, lg:h-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base">
              🛍️
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 tracking-tight">
                SmartDiscover
              </p>
              <span className="text-xs font-semibold text-indigo-600">
                SELLER
              </span>
            </div>
          </div>
          {/* Close on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Seller info */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.shopName || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 lg:sticky lg:bottom-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-600"
          >
            {/* Hamburger */}
            <div className="space-y-1.5">
              <span className="block w-5 h-0.5 bg-slate-600 rounded" />
              <span className="block w-5 h-0.5 bg-slate-600 rounded" />
              <span className="block w-5 h-0.5 bg-slate-600 rounded" />
            </div>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">
              🛍️
            </div>
            <span className="font-bold text-sm text-slate-900">
              SmartDiscover
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
