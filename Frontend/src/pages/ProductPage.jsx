/**
 * ProductsPage.jsx
 * Filter via dropdown panel — no sidebar.
 * Route: /products | Layout: BuyerLayout
 */
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAddToCart, useGetCart } from "@features/buyer/hooks/useCart";
import {
  useGetFavorites,
  useToggleFavorite,
} from "@features/buyer/hooks/useFavorites";
import useCategories from "@/features/categories/hooks/useCategory";
import { PAGINATION } from "@/config/config.pagination";
import { get } from "@/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

import ProductsGrid from "@features/buyer/components/products/ProductGrid";
import ActiveFilterChips from "@features/buyer/components/products/ActiveFilterChips";

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const useProducts = (params) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) query.set(k, v);
      });
      return get(`/products?${query.toString()}`);
    },
    placeholderData: (prev) => prev,
  });

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  // Draft price state — only writes to URL on Apply
  const [draftMin, setDraftMin] = useState(minPrice);
  const [draftMax, setDraftMax] = useState(maxPrice);

  useEffect(() => {
    setDraftMin(minPrice);
  }, [minPrice]);
  useEffect(() => {
    setDraftMax(maxPrice);
  }, [maxPrice]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data, isLoading } = useProducts({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  });
  const { data: catData } = useCategories();
  const { data: favData } = useGetFavorites({ limit: 100 });
  const { data: cartData } = useGetCart();
  const { mutateAsync: addToCart } = useAddToCart();
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const categories = catData?.categories ?? [];

  const favoritedIds = new Set(
    favData?.favorites?.map((f) => String(f.product_id?._id || f.product_id)) ??
      [],
  );
  const cartItemIds = new Set(
    cartData?.cart?.map((c) => String(c.product_id?._id || c.product_id)) ?? [],
  );

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams({ page: 1, limit });
    setDraftMin("");
    setDraftMax("");
    setFilterOpen(false);
  };

  const handleApplyPrice = () => {
    const next = new URLSearchParams(searchParams);
    draftMin ? next.set("minPrice", draftMin) : next.delete("minPrice");
    draftMax ? next.set("maxPrice", draftMax) : next.delete("maxPrice");
    next.set("page", "1");
    setSearchParams(next);
    setFilterOpen(false);
  };

  const handleRemovePrice = () => {
    setDraftMin("");
    setDraftMax("");
    const next = new URLSearchParams(searchParams);
    next.delete("minPrice");
    next.delete("maxPrice");
    setSearchParams(next);
  };

  const handleToggleFav = (productId) => {
    favoritedIds.has(String(productId))
      ? removeFav(productId)
      : addFav(productId);
  };

  const activeFilterCount = [
    search,
    category,
    minPrice || maxPrice,
    sort,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Filter bar ────────────────────────────── */}
        <div className="relative mb-5" ref={filterRef}>
          {/* Trigger row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen((p) => !p)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-foreground text-background">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Active chip: search */}
            {search && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                "{search}"
                <button
                  onClick={() => updateParam("search", "")}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {/* Active chip: category */}
            {category && (
              <Badge variant="secondary" className="gap-1.5 pr-1 capitalize">
                {categories.find((c) => c._id === category)?.name ?? "Category"}
                <button
                  onClick={() => updateParam("category", "")}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {/* Active chip: price */}
            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                ${minPrice || "0"} – ${maxPrice || "∞"}
                <button
                  onClick={handleRemovePrice}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {/* Active chip: sort */}
            {sort && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <button
                  onClick={() => updateParam("sort", "")}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {/* Reset all */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-destructive hover:underline font-medium ml-1"
              >
                Reset all
              </button>
            )}

            {/* Product count — pushed right */}
            <p className="ml-auto text-sm text-muted-foreground">
              {isLoading ? "Loading…" : `${total} products`}
            </p>
          </div>

          {/* ── Dropdown panel ──────────────────────── */}
          {filterOpen && (
            <div className="absolute left-0 top-full mt-2 z-30 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                {/* Category */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Category
                  </p>
                  <div className="space-y-0.5 max-h-56 overflow-y-auto">
                    <button
                      onClick={() => {
                        updateParam("category", "");
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        !category
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => {
                          updateParam("category", c._id);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                          category === c._id
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Price Range
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={draftMin}
                        onChange={(e) => setDraftMin(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={draftMax}
                        onChange={(e) => setDraftMax(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleApplyPrice}
                    >
                      Apply Price
                    </Button>
                  </div>
                </div>

                {/* Sort */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Sort By
                  </p>
                  <div className="space-y-0.5">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          updateParam("sort", opt.value);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          sort === opt.value
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex justify-end">
                <button
                  onClick={handleReset}
                  className="text-xs text-destructive hover:underline font-medium"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Product grid ──────────────────────────── */}
        <ProductsGrid
          products={products}
          isLoading={isLoading}
          total={total}
          totalPages={totalPages}
          cartItemIds={cartItemIds}
          favoritedIds={favoritedIds}
          onAddToCart={(id) => addToCart({ product_id: id, quantity: 1 })}
          onToggleFav={handleToggleFav}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
