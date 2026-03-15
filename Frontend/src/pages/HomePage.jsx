/**
 * HomePage.jsx
 *
 * Buyer homepage — smart discovery feed.
 * Each section is powered by a dedicated behavioral signal.
 *
 * Route: /
 * Layout: BuyerLayout
 */
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGetCart, useAddToCart } from "@features/buyer/hooks/useCart";
import {
  useForYou,
  useTrendingProducts,
  usePopularProducts,
  useRecentProducts,
  useReEngage,
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
import ForYouSection from "../features/buyer/components/home/ForyouSection";

/**
 * Normalize aggregate results (trending/popular) that come back
 * as { product: {...}, totalSold: n } into flat product objects
 */
const normalize = (arr) =>
  (arr ?? []).filter((t) => t?.product?._id).map((t) => ({ ...t.product }));

export default function HomePage() {
  const { user } = useAuthStore();
  const [prefOpen, setPrefOpen] = useState(false);

  // ── Discovery data ────────────────────────────────────────────
  const { data: forYouData, isLoading: forYouLoading } = useForYou();
  const { data: trendingData, isLoading: trendingLoading } =
    useTrendingProducts();
  const { data: popularData, isLoading: popularLoading } = usePopularProducts({
    limit: 10,
  });
  const { data: recentData, isLoading: recentLoading } = useRecentProducts();
  const { data: reEngageData, isLoading: reEngageLoading } = useReEngage();

  console.log("trending raw:", trendingData);
  console.log("popular raw:", popularData);

  // ── Favorites ─────────────────────────────────────────────────
  const { data: favData } = useGetFavorites({ limit: 100 });
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  // ── Cart ──────────────────────────────────────────────────────
  const { data: cartData } = useGetCart();
  const { mutate: addToCart, isPending: adding } = useAddToCart();

  // ── Derived data ──────────────────────────────────────────────
  const forYou = forYouData?.products ?? [];
  const trending = normalize(trendingData?.products);
  const popular = normalize(popularData?.products);
  const recent = recentData?.products ?? [];
  const reEngage = reEngageData?.products ?? [];

  // Source tag from backend — tells us if feed is personalised or fallback
  const forYouSource = forYouData?.source; // "personalised" | "cold_start" | "popular_fallback"

  const hasPrefs = user?.preferences?.length > 0;
  const isLoggedIn = !!user;

  const favoritedIds = new Set(
    favData?.favorites?.map((f) => String(f.product_id?._id || f.product_id)) ??
      [],
  );

  // FIX: cartItemIds was never computed — caused isInCart to always be false on homepage
  const cartItemIds = new Set(
    cartData?.cart?.map((c) => String(c.product_id?._id || c.product_id)) ?? [],
  );

  // ── Handlers ──────────────────────────────────────────────────
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
    cartItemIds, // ← FIX: now passed so ProductSection → ProductCard gets isInCart
  };

  // ── For You section title changes based on source ─────────────
  const forYouTitle =
    forYouSource === "cold_start" ? "🌟 Discover Products" : "✨ For You";

  const forYouSubtitle =
    forYouSource === "cold_start"
      ? "Browse around and we'll personalise this for you"
      : forYouSource === "popular_fallback"
        ? "Sign in to get personalised picks"
        : "Picked based on what you browse and buy";

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Nudge guest/no-prefs users to set preferences */}
        {isLoggedIn && !hasPrefs && (
          <PreferencesBanner onOpen={() => setPrefOpen(true)} />
        )}

        <CategoriesSection />

        <ForYouSection
          onAddToCart={(id) => addToCart({ product_id: id, quantity: 1 })}
          adding={adding}
          favoritedIds={favoritedIds}
          onToggleFav={handleToggleFav}
          cartItemIds={cartItemIds}
          onOpenPrefs={() => setPrefOpen(true)}
        />

        {/* 🎯 For You — main personalised feed (guests see popular fallback) */}
        <ProductSection
          title={forYouTitle}
          subtitle={forYouSubtitle}
          products={forYou}
          isLoading={forYouLoading}
          viewAllLink="/products"
          {...sharedProps}
        />

        {/* 🔥 Trending — personalised to user's categories if logged in */}
        <ProductSection
          title="🔥 Trending Now"
          subtitle={
            isLoggedIn && hasPrefs
              ? "Hot picks in your favourite categories"
              : "Hot picks from the last 7 days"
          }
          products={trending}
          isLoading={trendingLoading}
          {...sharedProps}
        />

        {/* ⏮ Re-Engage — viewed but not purchased (logged in only) */}
        {isLoggedIn && reEngage.length > 0 && (
          <ProductSection
            title="⏮ Still Interested?"
            subtitle="You looked at these but haven't picked them up yet"
            products={reEngage}
            isLoading={reEngageLoading}
            {...sharedProps}
          />
        )}

        {/* 🏆 Most Popular — all-time bestsellers */}
        <ProductSection
          title="🏆 Most Popular"
          subtitle="All-time bestsellers"
          products={popular}
          isLoading={popularLoading}
          viewAllLink="/products"
          {...sharedProps}
        />

        {/* 🆕 New Arrivals */}
        <ProductSection
          title="🆕 New Arrivals"
          subtitle="Just added to the store"
          products={recent}
          isLoading={recentLoading}
          viewAllLink="/products"
          {...sharedProps}
        />
      </div>

      <PreferencesModal isOpen={prefOpen} onClose={() => setPrefOpen(false)} />
    </div>
  );
}
