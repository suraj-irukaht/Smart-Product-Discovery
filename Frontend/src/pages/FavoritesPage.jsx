/**
 * FavoritesPage.jsx
 *
 * Buyer favorites page — orchestration only.
 * Lists all favorited products with remove + add to cart.
 *
 * Route: /favorites
 * Layout: BuyerLayout
 */
import { useState } from "react";
import {
  useGetFavorites,
  useToggleFavorite,
} from "@features/buyer/hooks/useFavorites";
import { useGetCart, useAddToCart } from "../features/buyer/hooks/useCart";
import FavoritesGrid from "../features/buyer/components/favotites/FavoritesGrid";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";

export default function FavoritesPage() {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const limit = PAGINATION.DEFAULT_LIMIT;

  const { data, isLoading } = useGetFavorites({ page, limit });
  const { data: cartData } = useGetCart();
  const { mutateAsync: addToCart } = useAddToCart();
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  const favorites = data?.favorites ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  console.log(data);

  const cartItemIds = new Set(
    cartData?.cart?.map((c) => String(c.product_id?._id || c.product_id)) ?? [],
  );

  const handleToggleFav = (productId) => removeFav(productId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Favorites
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isLoading
                ? "Loading..."
                : `${total} saved item${total !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-8 bg-slate-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && (
          <>
            <FavoritesGrid
              favorites={favorites}
              cartItemIds={cartItemIds}
              onAddToCart={(id) => addToCart({ product_id: id, quantity: 1 })}
              onToggleFav={handleToggleFav}
            />
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
