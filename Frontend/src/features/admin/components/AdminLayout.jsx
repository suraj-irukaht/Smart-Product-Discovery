/**
 * AdminLayout.jsx
 *
 * Persistent sidebar layout wrapper for all admin pages.
 * Renders navigation links, active state highlighting, and logout button.
 * Wrap all admin routes with this component via <Outlet />.
 *
 * Used in: AppRoutes.jsx (admin route group)
 * Depends on: useLogout (auth), NavLink (react-router-dom)
 */
import { NavLink, useNavigate } from "react-router-dom";
import { useLogout } from "@features/auth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/orders", label: "Orders", icon: "🛒" },
  { to: "/admin/products", label: "Products", icon: "📦" },
  { to: "/admin/categories", label: "Categories", icon: "🏷️" },
  { to: "/admin/users", label: "Buyers", icon: "👤" },
  { to: "/admin/sellers", label: "Sellers", icon: "🏪" },
];

export default function AdminLayout({ children }) {
  const { handleLogout } = useLogout();

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* ── Sidebar ───────────────────────────────── */}
      <aside
        className="w-56 shrink-0 flex flex-col border-r"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="font-bold text-base"
            style={{ color: "var(--color-foreground)" }}
          >
            🛍️ Admin Panel
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            Smart Discovery
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "transparent",
                color: isActive ? "#ffffff" : "var(--color-foreground)",
                opacity: 1,
              })}
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-all"
            style={{ color: "#ef4444" }}
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
