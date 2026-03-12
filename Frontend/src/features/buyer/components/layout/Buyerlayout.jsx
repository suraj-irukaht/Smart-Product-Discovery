/**
 * BuyerLayout.jsx
 *
 * Top navbar layout for all buyer pages.
 * Shows logo, search bar (navigates to /products), cart badge,
 * user name, edit profile dropdown, preferences, and logout.
 * Mobile: collapses to hamburger menu.
 *
 * Used in: AppRoutes.jsx buyer route group
 */
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "@features/auth";
import { useAuthStore } from "@/store/authStore";
import { useGetCart } from "../../hooks/useCart";
import PreferencesModal from "../modals/PreferencesModal";

export default function BuyerLayout() {
  const { handleLogout } = useLogout();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data } = useGetCart();

  console.log(data);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const cartCount = data?.cart?.length ?? 0;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "B";

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Navbar ────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              🛍️
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:block">
              SmartDiscover
            </span>
          </Link>

          {/* Spacer on mobile */}
          <div className="flex-1 md:hidden flex" />

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              My Orders
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-slate-900"}`
              }
            >
              ❤️ Favorites
            </NavLink>
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown — desktop */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user?.name?.split(" ")[0]}
              </span>
              <span className="text-slate-400 text-xs">
                {dropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPrefOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ⭐ My Preferences
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <span className="block w-5 h-0.5 bg-slate-600 rounded" />
            <span className="block w-5 h-0.5 bg-slate-600 rounded" />
            <span className="block w-5 h-0.5 bg-slate-600 rounded" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMenuOpen(false);
              }}
              className="mb-3"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
              />
            </form>
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              🏠 Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              📦 Products
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              🛒 My Orders
            </NavLink>
            <button
              onClick={() => {
                setPrefOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              ⭐ My Preferences
            </button>
            <div className="h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <PreferencesModal isOpen={prefOpen} onClose={() => setPrefOpen(false)} />
    </div>
  );
}
