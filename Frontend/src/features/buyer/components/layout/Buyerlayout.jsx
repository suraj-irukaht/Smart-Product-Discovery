/**
 * BuyerLayout.jsx
 * Top navbar + slide-in sidebar on mobile — same pattern as AdminLayout.
 */
import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useLogout } from "@features/auth";
import { useAuthStore } from "@/store/authStore";
import { useGetCart } from "../../hooks/useCart";
import PreferencesModal from "../modals/PreferencesModal";
import BuyerProfileModal from "../modals/ProfileModal";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Home,
  Package,
  ClipboardList,
  Heart,
  Star,
  LogOut,
  UserPen,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/favorites", label: "Favorites", icon: Heart },
];

export default function BuyerLayout() {
  const { handleLogout } = useLogout();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useGetCart();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = data?.cart?.length ?? 0;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "B";

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Mobile backdrop ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Slide-in sidebar (mobile only) ──────────── */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-dvh w-64 flex flex-col
        bg-card border-r border-border
        transition-transform duration-200 ease-in-out
        lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">
              SmartDiscover
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          <Separator className="my-2" />

          <button
            onClick={() => {
              setProfileOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <UserPen className="w-4 h-4 shrink-0" />
            Edit Profile
          </button>

          <button
            onClick={() => {
              setPrefOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Star className="w-4 h-4 shrink-0" />
            My Preferences
          </button>
        </nav>

        <Separator />

        {/* Logout */}
        <div className="px-3 py-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Top Navbar ───────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted transition-colors text-foreground shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight hidden sm:block">
              SmartDiscover
            </span>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xs mx-4 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </form>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 ml-auto">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <Link
            to="/cart"
            className="relative ml-auto flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted transition-colors shrink-0"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Avatar button — desktop only */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-[10px] font-bold">
                {initials}
              </div>
              <UserPen className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <PreferencesModal isOpen={prefOpen} onClose={() => setPrefOpen(false)} />
      <BuyerProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
