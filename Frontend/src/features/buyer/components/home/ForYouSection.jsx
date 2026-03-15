/**
 * ForYouSection.jsx
 * Shows products from buyer's selected preference categories.
 * Re-fetches when preferences change.
 */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { get } from "@/utils/request";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings2 } from "lucide-react";

const useForYouProducts = (categoryIds) =>
  useQuery({
    // ✅ stable string key — triggers refetch when IDs change
    queryKey: ["for-you", categoryIds.join(",")],
    queryFn: async () => {
      // Fetch up to 4 products per selected category in parallel, then merge
      const promises = categoryIds.map((id) =>
        get(`/products?category=${id}&limit=4&sort=newest`),
      );
      const results = await Promise.all(promises);
      const seen = new Set();
      const merged = [];
      for (const r of results) {
        for (const p of r.products ?? []) {
          if (!seen.has(p._id)) {
            seen.add(p._id);
            merged.push(p);
          }
        }
      }
      return merged;
    },
    enabled: categoryIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });

export default function ForYouSection({
  onAddToCart,
  adding,
  favoritedIds,
  onToggleFav,
  cartItemIds,
  onOpenPrefs,
}) {
  const { user } = useAuthStore();

  // ✅ Handle both populated objects { _id, name } and plain ID strings
  const prefIds = (user?.preferences ?? [])
    .map((p) => (typeof p === "object" ? p._id : p))
    .filter(Boolean);

  const { data: products = [], isLoading } = useForYouProducts(prefIds);

  // ── No preferences set ──────────────────────────────────
  if (!prefIds.length) {
    return (
      <section>
        <SectionHeader
          title="✨ For You"
          subtitle="Picked based on what you love"
        />
        <div className="flex flex-col items-center justify-center py-14 gap-4 bg-card border border-dashed border-border rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">No preferences set</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tell us what you like and we'll curate products for you
            </p>
          </div>
          <Button size="sm" onClick={onOpenPrefs} className="gap-2">
            <Settings2 className="w-4 h-4" />
            Set Preferences
          </Button>
        </div>
      </section>
    );
  }

  // ── Loading skeletons ───────────────────────────────────
  if (isLoading) {
    return (
      <section>
        <SectionHeader
          title="✨ For You"
          subtitle="Picked based on what you love"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Empty results ───────────────────────────────────────
  if (!products.length) {
    return (
      <section>
        <SectionHeader
          title="✨ For You"
          subtitle="Picked based on what you love"
        />
        <div className="flex flex-col items-center justify-center py-14 gap-3 bg-card border border-dashed border-border rounded-2xl">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No products in your selected categories yet
          </p>
          <button
            onClick={onOpenPrefs}
            className="text-xs font-medium text-foreground hover:underline"
          >
            Update preferences
          </button>
        </div>
      </section>
    );
  }

  // ── Products grid ───────────────────────────────────────
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            ✨ For You
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Picked based on what you love
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPrefs}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Edit Preferences
          </button>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.slice(0, 10).map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={() => onAddToCart(p._id)}
            adding={adding}
            isFavorited={favoritedIds?.has(String(p._id))}
            onToggleFav={() => onToggleFav(p._id)}
            isInCart={cartItemIds?.has(String(p._id))}
          />
        ))}
      </div>
    </section>
  );
}
