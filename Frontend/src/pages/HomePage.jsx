/**
 * HomePage.jsx
 *
 * Buyer homepage — Smart Product Discovery feed.
 *
 * Route: /
 * Layout: BuyerLayout
 *
 * This page combines multiple discovery signals to surface products:
 *
 * Sections:
 * --------
 * • Hero Banner
 * • Category Browser
 * • Preference Nudge (for new users)
 * • Curated Picks (explicit preferences)
 * • For You (behavioural personalisation)
 * • Trending (recent popularity)
 * • Re-engage (previously viewed items)
 * • Most Popular (all-time best sellers)
 * • New Arrivals (recently added products)
 */

import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                               GLOBAL STORES                                */
/* -------------------------------------------------------------------------- */

import { useAuthStore } from "@/store/authStore";

/* -------------------------------------------------------------------------- */
/*                               BUYER HOOKS                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              UI COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

import HeroSection from "../features/buyer/components/home/HeroBanner";
import PreferencesBanner from "../features/buyer/components/home/PreferencesBanner";
import CategoriesSection from "../features/buyer/components/home/CategoriesSection";
import ProductSection from "../features/buyer/components/home/ProductSection";
import PreferencesModal from "../features/buyer/components/modals/PreferencesModal";
import ForYouSection from "../features/buyer/components/home/ForyouSection";

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

/**
 * Normalize aggregated discovery results
 *
 * Some endpoints return:
 * { product: {...}, totalSold: number }
 *
 * This helper flattens the structure to:
 * { ...product }
 */
const normalize = (arr) =>
  (arr ?? []).filter((t) => t?.product?._id).map((t) => ({ ...t.product }));

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  /* ---------------------------------------------------------------------- */
  /*                                STATE                                   */
  /* ---------------------------------------------------------------------- */

  const { user } = useAuthStore();
  const [prefOpen, setPrefOpen] = useState(false);

  const isLoggedIn = !!user;
  const hasPrefs = user?.preferences?.length > 0;

  /* ---------------------------------------------------------------------- */
  /*                           DISCOVERY QUERIES                            */
  /* ---------------------------------------------------------------------- */

  const { data: forYouData, isLoading: forYouLoading } = useForYou();

  const { data: trendingData, isLoading: trendingLoading } =
    useTrendingProducts();

  const { data: popularData, isLoading: popularLoading } = usePopularProducts({
    limit: 10,
  });

  const { data: recentData, isLoading: recentLoading } = useRecentProducts();

  const { data: reEngageData, isLoading: reEngageLoading } = useReEngage();

  /* ---------------------------------------------------------------------- */
  /*                               FAVORITES                                */
  /* ---------------------------------------------------------------------- */

  const { data: favData } = useGetFavorites({ limit: 100 });
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  /* ---------------------------------------------------------------------- */
  /*                                  CART                                  */
  /* ---------------------------------------------------------------------- */

  const { data: cartData } = useGetCart();
  const { mutate: addToCart, isPending: adding } = useAddToCart();

  /* ---------------------------------------------------------------------- */
  /*                           DERIVED DATA                                 */
  /* ---------------------------------------------------------------------- */

  const forYou = forYouData?.products ?? [];
  const trending = normalize(trendingData?.products);
  const popular = normalize(popularData?.products);
  const recent = recentData?.products ?? [];
  const reEngage = reEngageData?.products ?? [];

  /**
   * Backend tells us how the "For You" feed was generated
   *
   * possible values:
   *  - personalised
   *  - cold_start
   *  - popular_fallback
   */
  const forYouSource = forYouData?.source;

  /**
   * Create lookup sets for quick checks inside product cards
   */

  const favoritedIds = new Set(
    favData?.favorites?.map((f) => String(f.product_id?._id || f.product_id)) ??
      [],
  );

  const cartItemIds = new Set(
    cartData?.cart?.map((c) => String(c.product_id?._id || c.product_id)) ?? [],
  );

  /* ---------------------------------------------------------------------- */
  /*                              HANDLERS                                  */
  /* ---------------------------------------------------------------------- */

  const handleAddToCart = (productId) =>
    addToCart({ product_id: productId, quantity: 1 });

  const handleToggleFav = (productId) => {
    if (favoritedIds.has(String(productId))) {
      removeFav(productId);
    } else {
      addFav(productId);
    }
  };

  /**
   * Shared props passed into ProductSection
   * to keep JSX clean and avoid repetition
   */

  const sharedProps = {
    onAddToCart: handleAddToCart,
    adding,
    favoritedIds,
    onToggleFav: handleToggleFav,
    cartItemIds,
  };

  /* ---------------------------------------------------------------------- */
  /*                      DYNAMIC TITLE / SUBTITLE                          */
  /* ---------------------------------------------------------------------- */

  const forYouTitle =
    forYouSource === "cold_start" ? "Discover Products" : "Top Picks For You";

  const forYouSubtitle =
    forYouSource === "cold_start"
      ? "Browse around and we'll personalise this for you"
      : forYouSource === "popular_fallback"
        ? "Sign in to get personalised picks"
        : "Picked based on what you browse and buy";

  const feedSections = [
    {
      id: "forYou",
      title: forYouTitle,
      subtitle: forYouSubtitle,
      products: forYou,
      loading: forYouLoading,
      viewAll: "/products",
    },
    {
      id: "trending",
      title: "Trending Now",
      subtitle:
        isLoggedIn && hasPrefs
          ? "Hot picks in your favourite categories"
          : "Hot picks from the last 7 days",
      products: trending,
      loading: trendingLoading,
    },
    {
      id: "reengage",
      title: "Still Interested?",
      subtitle: "You looked at these but haven't picked them up yet",
      products: reEngage,
      loading: reEngageLoading,
      condition: isLoggedIn && reEngage.length > 0,
    },
    {
      id: "popular",
      title: "Most Popular",
      subtitle: "All-time bestsellers",
      products: popular,
      loading: popularLoading,
      viewAll: "/products",
    },
    {
      id: "recent",
      title: "New Arrivals",
      subtitle: "Just added to the store",
      products: recent,
      loading: recentLoading,
      viewAll: "/products",
    },
  ];

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="bg-slate-50 pb-10 lg:pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* HERO BANNER                                                        */}
      {/* ------------------------------------------------------------------ */}

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* -------------------------------------------------------------- */}
        {/* PREFERENCES NUDGE                                             */}
        {/* Encourage users without preferences to set interests          */}
        {/* -------------------------------------------------------------- */}

        {isLoggedIn && !hasPrefs && (
          <PreferencesBanner onOpen={() => setPrefOpen(true)} />
        )}

        {/* -------------------------------------------------------------- */}
        {/* CATEGORY BROWSER                                              */}
        {/* Quick entry point to explore product categories               */}
        {/* -------------------------------------------------------------- */}

        <CategoriesSection />

        {/* -------------------------------------------------------------- */}
        {/* PREFERENCES-BASED PICKS                                       */}
        {/* Uses explicit preferences set by the user                     */}
        {/* -------------------------------------------------------------- */}

        <ForYouSection
          onAddToCart={handleAddToCart}
          adding={adding}
          favoritedIds={favoritedIds}
          onToggleFav={handleToggleFav}
          cartItemIds={cartItemIds}
          onOpenPrefs={() => setPrefOpen(true)}
        />

        {/* -------------------------------------------------------------- */}
        {/* BEHAVIOURAL PERSONALISATION                                    */}
        {/* Main discovery feed powered -----------------------------------*/}
        {/* -------------------------------------------------------------- */}

        {feedSections.map((section) => {
          if (section.condition === false) return null;

          return (
            <ProductSection
              key={section.id}
              title={section.title}
              subtitle={section.subtitle}
              products={section.products}
              isLoading={section.loading}
              viewAllLink={section.viewAll}
              {...sharedProps}
            />
          );
        })}
      </div>

      {/* -------------------------------------------------------------- */}
      {/* PREFERENCES MODAL                                             */}
      {/* -------------------------------------------------------------- */}

      <PreferencesModal isOpen={prefOpen} onClose={() => setPrefOpen(false)} />
    </div>
  );
}
