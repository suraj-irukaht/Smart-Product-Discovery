import { Link } from "react-router-dom";
import { useAdminStats } from "@features/admin";
import { useLogout } from "@features/auth";

const STATS = [
  { key: "totalUsers", label: "Total Buyers", icon: "👤", color: "#6366f1" },
  { key: "totalSellers", label: "Total Sellers", icon: "🏪", color: "#f59e0b" },
  {
    key: "totalProducts",
    label: "Total Products",
    icon: "📦",
    color: "#22c55e",
  },
  { key: "totalOrders", label: "Total Orders", icon: "🛒", color: "#3b82f6" },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: "💰",
    color: "#ef4444",
    isMoney: true,
  },
];

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();
  const { handleLogout } = useLogout();

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-foreground)" }}
            >
              Admin Dashboard
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Platform overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {STATS.map(({ key, label, icon, color, isMoney }) => (
              <div
                key={key}
                className="rounded-xl p-5 border"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                  style={{ backgroundColor: `${color}20` }}
                >
                  {icon}
                </div>
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {isMoney
                    ? `$${Number(data?.[key] ?? 0).toLocaleString()}`
                    : (data?.[key] ?? 0).toLocaleString()}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/orders"
            className="rounded-xl p-5 border flex items-center gap-4 hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-2xl">🛒</span>
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                Manage Orders
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                View and update order statuses
              </p>
            </div>
            <span
              className="ml-auto"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              →
            </span>
          </Link>
          <Link
            to="/admin/products"
            className="rounded-xl p-5 border flex items-center gap-4 hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-2xl">📦</span>
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                Manage Products
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                View and delete products
              </p>
            </div>
            <span
              className="ml-auto"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              →
            </span>
          </Link>

          <Link
            to="/admin/users"
            className="rounded-xl p-5 border flex items-center gap-4 hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-2xl">👥</span>
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                Manage Users
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                View and manage buyers accounts
              </p>
            </div>
            <span
              className="ml-auto"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              →
            </span>
          </Link>

          <Link
            to="/admin/sellers"
            className="rounded-xl p-5 border flex items-center gap-4 hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-2xl">🏪</span>
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                Manage Sellers
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                View and manage seller accounts
              </p>
            </div>
            <span
              className="ml-auto"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              →
            </span>
          </Link>
          <Link
            to="/admin/categories"
            className="rounded-xl p-5 border flex items-center gap-4 hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-2xl">🏷️</span>
            <div>
              <p
                className="font-semibold"
                style={{ color: "var(--color-foreground)" }}
              >
                Manage Categories
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                Create, edit, and delete categories
              </p>
            </div>
            <span
              className="ml-auto"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
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
  );
}
