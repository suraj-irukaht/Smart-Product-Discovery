import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useAllProducts,
  useToggleProductStatus,
  useDeleteProductByAdmin,
} from "@features/admin";
import useCategories from "@features/categories/hooks/useCategory";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Package, Search, X, RotateCcw, SlidersHorizontal } from "lucide-react";

// ── Debounce hook ────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── URL state ──────────────────────────────────────────
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  // ── Local search input (debounced before hitting URL) ──
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search → URL
  // useRef skips the effect on first mount — prevents page resetting to 1 on refresh
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("search", debouncedSearch);
        else next.delete("search");
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch]);

  // ── Popover controlled open state ─────────────────────
  const [filterOpen, setFilterOpen] = useState(false);

  // Draft holds uncommitted filter values inside the popover
  const [draft, setDraft] = useState({ category, minPrice, maxPrice, sort });

  // When popover opens, sync draft to current URL values
  const handleOpenChange = (open) => {
    if (open) setDraft({ category, minPrice, maxPrice, sort });
    setFilterOpen(open);
  };

  const handleApply = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        draft.category
          ? next.set("category", draft.category)
          : next.delete("category");
        draft.minPrice
          ? next.set("minPrice", draft.minPrice)
          : next.delete("minPrice");
        draft.maxPrice
          ? next.set("maxPrice", draft.maxPrice)
          : next.delete("maxPrice");
        draft.sort ? next.set("sort", draft.sort) : next.delete("sort");
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
    setFilterOpen(false);
  };

  const handleReset = () => {
    setDraft({ category: "", minPrice: "", maxPrice: "", sort: "" });
    setSearchInput("");
    setSearchParams({ page: 1, limit });
    setFilterOpen(false);
  };

  const hasActiveFilters = search || category || minPrice || maxPrice || sort;

  // ── Data ───────────────────────────────────────────────
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

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const categories = catData?.categories ?? [];

  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className="min-h-screen bg-background pb-30 px-4">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* ── Header ────────────────────────────────────── */}
        <div className="flex items-center justify-between sticky top-0 z-50 bg-white -mx-4 p-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data?.total ?? 0} total products
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* ── Search + Filter row ───────────────────────── */}
        <div className="flex items-center gap-2 mb-10">
          {/* Search input */}
          <div className="relative flex-1 max-w-80 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter popover button */}
          <Popover open={filterOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 shrink-0 relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset all
                  </button>
                )}
              </div>

              <Separator />

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <Select
                  value={draft.category || "all"}
                  onValueChange={(v) =>
                    setDraft((p) => ({ ...p, category: v === "all" ? "" : v }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All Categories
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Price range
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min $"
                    value={draft.minPrice}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, minPrice: e.target.value }))
                    }
                    className="h-8 text-xs"
                  />
                  <span className="text-muted-foreground text-xs shrink-0">
                    to
                  </span>
                  <Input
                    type="number"
                    placeholder="Max $"
                    value={draft.maxPrice}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, maxPrice: e.target.value }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Sort by
                </label>
                <Select
                  value={draft.sort || "newest"}
                  onValueChange={(v) =>
                    setDraft((p) => ({ ...p, sort: v === "newest" ? "" : v }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest" className="text-xs">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="text-xs">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="price_asc" className="text-xs">
                      Price: Low → High
                    </SelectItem>
                    <SelectItem value="price_desc" className="text-xs">
                      Price: High → Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Apply */}
              <Button onClick={handleApply} className="w-full h-8 text-xs">
                Apply Filters
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        {/* ── Loading skeletons ─────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-xl" />
                <CardContent className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-6 bg-muted rounded mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty ─────────────────────────────────────── */}
        {!isLoading && products.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
              <Package className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No products found</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Product Cards Grid ────────────────────────── */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                toggling={toggling}
                onToggle={() => toggleStatus(product._id)}
                onDelete={() => setDeleteId(product._id)}
              />
            ))}
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>

      {/* ── Delete Confirm Dialog ────────────────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) })
              }
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Product card ─────────────────────────────────────────────
function ProductCard({ product, toggling, onToggle, onDelete }) {
  const isActive = product.status === "ACTIVE";
  const image = product.main_image || product.mainImage;

  return (
    <Card className="py-0 mb-3 overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full  h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {/* Status pill overlay */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.status}
        </span>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Name */}
        <p className="text-sm font-medium text-foreground line-clamp-1">
          {product.name}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs text-muted-foreground capitalize truncate">
            {product.category?.name ?? "—"}
          </span>
          <span className="text-sm font-semibold text-foreground shrink-0">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* Seller + stock */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate capitalize">
            {product.seller?.name ?? "—"}
          </span>
          <span
            className={
              product.stock === 0 ? "text-destructive font-medium" : ""
            }
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
          </span>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-1.5 pt-0.5">
          <Button
            variant="outline"
            size="sm"
            disabled={toggling}
            onClick={onToggle}
            className={`flex-1 h-7 text-[11px] font-medium ${
              isActive
                ? "text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 h-7 text-[11px] font-medium text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
