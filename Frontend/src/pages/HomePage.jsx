/**
 * HomePage.jsx
 *
 * Buyer homepage — composed entirely from section components.
 * Responsible only for: fetching data, wiring favorites, passing props down.
 *
 * Route: /
 * Layout: BuyerLayout
 */
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAddToCart } from "@features/buyer/hooks/useCart";
import {
  useTrendingProducts,
  useRecentProducts,
  useRecommendedProducts,
  useRecentlyViewed,
  usePopularProducts,
} from "@features/buyer/hooks/useDiscovery";
import {
  useGetFavorites,
  useToggleFavorite,
} from "@features/buyer/hooks/useFavorites";

import HeroSection from "../features/buyer/components/home/HeroBanner";
import PreferencesBanner from "../features/buyer/components/home/PreferencesBanner";
import CategoriesSection from "../features/buyer/components/home/CategoriesSection";
import ProductSection from "../features/buyer/components/home/ProductSection";
import PreferencesModal from "../features/buyer/components/modals/PreferencesModal";

// Normalize aggregate results (trending/popular) into flat product objects
const normalize = (arr) =>
  (arr ?? []).filter((t) => t?.product?._id).map((t) => ({ ...t.product }));

export default function HomePage() {
  const { user } = useAuthStore();
  const [prefOpen, setPrefOpen] = useState(false);

  // ── Data fetching ────────────────────────────
  const { data: trendingData } = useTrendingProducts();
  const { data: recentData } = useRecentProducts();
  const { data: recommendedData } = useRecommendedProducts();
  const { data: recentlyViewedData } = useRecentlyViewed();
  const { data: popularData } = usePopularProducts({ limit: 10 });
  const { data: favData } = useGetFavorites({ limit: 100 });

  const { mutate: addToCart, isPending: adding } = useAddToCart();
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  // ── Derived data ─────────────────────────────
  const trending = normalize(trendingData?.products);
  const popular = normalize(popularData?.products);
  const recent = recentData?.products ?? [];
  const recommended = recommendedData?.products ?? [];
  const recentlyViewed = recentlyViewedData?.products ?? [];
  const hasPrefs = user?.preferences?.length > 0;

  const favoritedIds = new Set(
    favData?.favorites?.map((f) => String(f.product_id?._id || f.product_id)) ??
      [],
  );

  // ── Handlers ─────────────────────────────────
  const handleAddToCart = (productId) =>
    addToCart({ product_id: productId, quantity: 1 });

  const handleToggleFav = (productId) => {
    if (favoritedIds.has(String(productId))) {
      removeFav(productId);
    } else {
      addFav(productId);
    }
  };

  const sharedProps = {
    onAddToCart: handleAddToCart,
    adding,
    favoritedIds,
    onToggleFav: handleToggleFav,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {!hasPrefs && <PreferencesBanner onOpen={() => setPrefOpen(true)} />}

        <CategoriesSection />

        {hasPrefs && (
          <ProductSection
            title="✨ Recommended for You"
            subtitle="Based on your preferences"
            products={recommended}
            viewAllLink="/products"
            {...sharedProps}
          />
        )}

        <ProductSection
          title="🔥 Trending Now"
          subtitle="Hot picks from the last 7 days"
          products={trending}
          {...sharedProps}
        />

        <ProductSection
          title="⭐ Most Popular"
          subtitle="All-time bestsellers"
          products={popular}
          viewAllLink="/products"
          {...sharedProps}
        />

        <ProductSection
          title="🆕 New Arrivals"
          subtitle="Just added to the store"
          products={recent}
          viewAllLink="/products"
          {...sharedProps}
        />

        {recentlyViewed.length > 0 && (
          <ProductSection
            title="🕐 Recently Viewed"
            subtitle="Pick up where you left off"
            products={recentlyViewed}
            {...sharedProps}
          />
        )}
      </div>

      <PreferencesModal isOpen={prefOpen} onClose={() => setPrefOpen(false)} />
    </div>
  );
}
