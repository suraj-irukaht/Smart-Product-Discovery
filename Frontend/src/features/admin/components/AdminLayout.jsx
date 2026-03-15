/**
 * AdminLayout.jsx
 *
 * Single sidebar — CSS handles both desktop and mobile:
 *   - Desktop (md+): relative, always visible, translate-x-0 locked
 *   - Mobile: fixed, slides in/out via translate-x
 *
 * One <aside>, no duplication.
 */
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLogout } from "@features/auth";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Store,
  LogOut,
  Sparkles,
  Menu,
} from "lucide-react";
import NotificationBell from "../components/NotificationBell";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/users", label: "Buyers", icon: Users },
  { to: "/admin/sellers", label: "Sellers", icon: Store },
];

export default function AdminLayout({ children }) {
  const { handleLogout } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Backdrop (mobile only) ───────────────────── */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-60 border-r bg-card
          transition-transform duration-300 ease-in-out
         lg:translate-x-0 lg:shadow-none
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground leading-tight">
              Admin Panel
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Smart Discovery
            </p>
          </div>
          <NotificationBell />
        </div>

        <Separator />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Separator />

        {/* Logout */}
        <div className="p-3 shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 pb-20">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 border-b bg-card shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              Admin Panel
            </span>
          </div>
          <NotificationBell />
        </header>

        {/* Page content */}
        <main className="flex-1  lg:pl-60">{children}</main>
      </div>
    </div>
  );
}
