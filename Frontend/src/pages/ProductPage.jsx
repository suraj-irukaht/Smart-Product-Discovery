/**
 * ProductsPage.jsx
 *
 * Product listing page — orchestration only.
 * All filter state lives in URL params.
 * Delegates rendering to: ProductsSidebar, ProductsGrid, ActiveFilterChips.
 *
 * Route: /products
 * Layout: BuyerLayout
 */
import { useState, useEffect } from "react";
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

import ProductsSidebar from "@features/buyer/components/products/ProductSidebar";
import ProductsGrid from "@features/buyer/components/products/ProductGrid";
import ActiveFilterChips from "@features/buyer/components/products/ActiveFilterChips";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  useEffect(() => {
    setPriceMin(minPrice);
  }, [minPrice]);
  useEffect(() => {
    setPriceMax(maxPrice);
  }, [maxPrice]);

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
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams({ page: 1, limit });
    setPriceMin("");
    setPriceMax("");
  };

  const handlePriceBlur = () => {
    const next = new URLSearchParams(searchParams);
    if (priceMin) {
      next.set("minPrice", priceMin);
    } else {
      next.delete("minPrice");
    }
    if (priceMax) {
      next.set("maxPrice", priceMax);
    } else {
      next.delete("maxPrice");
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleToggleFav = (productId) => {
    if (favoritedIds.has(String(productId))) {
      removeFav(productId);
    } else {
      addFav(productId);
    }
  };

  const handleRemovePrice = () => {
    setPriceMin("");
    setPriceMax("");
    const next = new URLSearchParams(searchParams);
    next.delete("minPrice");
    next.delete("maxPrice");
    setSearchParams(next);
  };

  const hasActiveFilters = search || category || minPrice || maxPrice || sort;

  const sidebarProps = {
    search,
    category,
    sort,
    priceMin,
    priceMax,
    categories,
    hasActiveFilters,
    updateParam,
    handleReset,
    handlePriceBlur,
    setPriceMin,
    setPriceMax,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    Reset all
                  </button>
                )}
              </div>
              <div className="p-5">
                <ProductsSidebar {...sidebarProps} />
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl z-50 overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-bold text-slate-900 text-base">Filters</p>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-xl"
                  >
                    ✕
                  </button>
                </div>
                <ProductsSidebar {...sidebarProps} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ActiveFilterChips
              total={total}
              isLoading={isLoading}
              search={search}
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              categories={categories}
              onRemoveSearch={() => updateParam("search", "")}
              onRemoveCategory={() => updateParam("category", "")}
              onRemovePrice={handleRemovePrice}
              onOpenSidebar={() => setSidebarOpen(true)}
            />

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
      </div>
    </div>
  );
}
