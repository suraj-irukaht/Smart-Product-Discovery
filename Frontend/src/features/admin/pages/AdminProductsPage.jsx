import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useAllProducts,
  useToggleProductStatus,
  useDeleteProductByAdmin,
} from "@features/admin";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import { PAGINATION } from "@/config/config.pagination";
import useCategories from "../../../features/categories/hooks/useCategory";

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Read from URL ──────────────────────────────────────
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  // ── Local filter input state ───────────────────────────
  const [filters, setFilters] = useState({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── Data fetching ──────────────────────────────────────
  const { data, isLoading } = useAllProducts({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  });
  const { mutate: toggleStatus, isPending: toggling } =
    useToggleProductStatus();
  const { mutate: deleteProduct, isPending: deleting } =
    useDeleteProductByAdmin();
  const { data: catData } = useCategories();

  // ── Derived ────────────────────────────────────────────
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const categories = catData?.categories ?? [];

  console.log(products);

  // ── Handlers ───────────────────────────────────────────
  const handleApply = () => {
    const params = { page: 1, limit };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
    setSearchParams({ page: 1, limit });
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteProduct(confirmDeleteId, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  };

  const inputClass =
    "border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            Manage Products
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {data?.total ?? 0} total products
          </p>
        </div>

        {/* Filters */}
        <div
          className="rounded-xl border p-4 mb-6 space-y-3"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <input
              placeholder="Search name or brand..."
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
              className={`${inputClass} col-span-2 md:col-span-1`}
              style={inputStyle}
            />
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((p) => ({ ...p, category: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((p) => ({ ...p, minPrice: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((p) => ({ ...p, maxPrice: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            />
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((p) => ({ ...p, sort: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            >
              <option value="">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border text-sm hover:opacity-80"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Empty */}
        {!isLoading && products.length === 0 && (
          <div
            className="text-center py-20 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-4xl mb-3">📦</p>
            <p
              className="font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              No products found
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && products.length > 0 && (
          <div
            className="rounded-xl border overflow-x-auto"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-muted)",
                  }}
                >
                  {[
                    "Product",
                    "Brand",
                    "Seller",
                    "Category",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium whitespace-nowrap"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom:
                        i < products.length - 1
                          ? "1px solid var(--color-border)"
                          : "none",
                    }}
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.main_image ? (
                          <img
                            src={product.main_image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-muted)" }}
                          >
                            {product.mainImage ? (
                              <img src={product.mainImage} />
                            ) : (
                              <span className="text-lg">📦</span>
                            )}
                          </div>
                        )}
                        <p
                          className="font-medium line-clamp-1"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {product.name}
                        </p>
                      </div>
                    </td>

                    {/* Brand */}
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {product.brand || "—"}
                    </td>

                    {/* Seller */}
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {product.seller?.name ?? "—"}
                    </td>

                    {/* Category */}
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {product.category?.name ?? "—"}
                    </td>

                    {/* Price */}
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      ${Number(product.price).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            product.stock === 0
                              ? "#ef4444"
                              : "var(--color-foreground)",
                        }}
                      >
                        {product.stock === 0 ? "-" : product.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor:
                            product.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                          color:
                            product.status === "ACTIVE" ? "#15803d" : "#991b1b",
                        }}
                      >
                        {product.status ?? "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(product._id)}
                          disabled={toggling}
                          className="rounded-md px-3 py-1 text-xs font-medium border hover:opacity-80 disabled:opacity-40 whitespace-nowrap"
                          style={{
                            borderColor:
                              product.status === "ACTIVE"
                                ? "#f59e0b"
                                : "#22c55e",
                            color:
                              product.status === "ACTIVE"
                                ? "#f59e0b"
                                : "#22c55e",
                          }}
                        >
                          {product.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(product._id)}
                          disabled={deleting}
                          className="rounded-md px-3 py-1 text-xs font-medium border hover:opacity-80 disabled:opacity-40"
                          style={{ borderColor: "#ef4444", color: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm mx-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--color-foreground)" }}
            >
              Delete Product
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: "#ef4444" }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
