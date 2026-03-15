import { Link } from "react-router-dom";
import { useAdminStats, useAdminCharts } from "@features/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Stat card config ─────────────────────────────────────────
const STATS = [
  {
    key: "totalUsers",
    label: "Total Buyers",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950",
    trend: "+12%",
    up: true,
  },
  {
    key: "totalSellers",
    label: "Total Sellers",
    icon: Store,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950",
    trend: "+3",
    up: true,
  },
  {
    key: "totalProducts",
    label: "Products",
    icon: Package,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    trend: "Active",
    up: null,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950",
    trend: "All time",
    up: null,
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: DollarSign,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950",
    isMoney: true,
    trend: "Paid + Delivered",
    up: null,
  },
];

// ── Order status colors ──────────────────────────────────────
const STATUS_COLORS = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PAID: "#6366f1",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

// ── Custom tooltip ───────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, isMoney }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }}>
          {p.name}: {isMoney ? `$${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: charts, isLoading: chartsLoading } = useAdminCharts();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              SmartDiscover platform overview
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live
          </Badge>
        </div>

        {/* ── Stat Cards ──────────────────────────────── */}
        {statsLoading ? (
          <StatSkeletons />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            {STATS.map(
              ({ key, label, icon: Icon, color, bg, isMoney, trend, up }) => (
                <Card
                  key={key}
                  className="border hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg}`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="text-xl font-bold text-foreground leading-tight">
                      {isMoney
                        ? `$${Number(stats?.[key] ?? 0).toLocaleString()}`
                        : (stats?.[key] ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-foreground mt-0.5">
                      {label}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {up === true && (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      )}
                      {up === false && (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      {up === null && (
                        <Minus className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span
                        className={`text-[10px] ${
                          up === true
                            ? "text-emerald-500"
                            : up === false
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }`}
                      >
                        {trend}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}

        <Separator />

        {/* ── Charts (Tabbed) ──────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Analytics
            </h2>
          </div>

          {chartsLoading ? (
            <ChartSkeleton />
          ) : (
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Top Products</TabsTrigger>
                <TabsTrigger value="users">New Buyers</TabsTrigger>
              </TabsList>

              {/* Revenue */}
              <TabsContent value="revenue">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      Revenue Over Time
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Monthly revenue — last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={charts?.revenueByMonth ?? []}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip content={<ChartTooltip isMoney />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#6366f1"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#6366f1" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders by status */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      Orders by Status
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Distribution across all statuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={charts?.ordersByStatus ?? []}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="45%"
                          outerRadius={100}
                          innerRadius={50}
                          paddingAngle={3}
                          label={({ status, percent }) =>
                            `${status} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {(charts?.ordersByStatus ?? []).map((entry) => (
                            <Cell
                              key={entry.status}
                              fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Top products */}
              <TabsContent value="products">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      Top 5 Products
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Most sold by units
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={charts?.topProducts ?? []}
                        layout="vertical"
                        margin={{ left: 10, right: 30 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          width={120}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                          dataKey="totalSold"
                          name="Units Sold"
                          fill="#6366f1"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* New buyers */}
              <TabsContent value="users">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      New Buyers
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Monthly registrations — last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={charts?.newUsersByMonth ?? []}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                          dataKey="newUsers"
                          name="New Buyers"
                          fill="#22c55e"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <Separator />

        {/* ── Recent Orders ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Recent Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {chartsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 h-16" />
                </Card>
              ))}
            </div>
          ) : (charts?.recentOrders ?? []).length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                No orders yet
              </CardContent>
            </Card>
          ) : (
            <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {(charts?.recentOrders ?? []).map((order) => (
                <Card
                  key={order.id}
                  className="border hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Status dot */}
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[order.status] ?? "#94a3b8",
                        }}
                      />

                      {/* Order ID + buyer */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-foreground">
                            #{order.id}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${STATUS_COLORS[order.status]}20`,
                              color: STATUS_COLORS[order.status] ?? "#94a3b8",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {order.buyer} · {order.email}
                        </p>
                      </div>

                      {/* Amount + date */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-foreground">
                          ${Number(order.amount).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeletons ────────────────────────────────────────────────
function StatSkeletons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border animate-pulse">
          <CardContent className="p-4 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-muted" />
            <div className="h-6 w-2/3 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card className="border animate-pulse">
      <CardContent className="p-6">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-3 w-48 bg-muted rounded mb-6" />
        <div className="h-64 bg-muted rounded-lg" />
      </CardContent>
    </Card>
  );
}
