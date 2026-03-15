import { useQuery } from "@tanstack/react-query";
import {
  fetchForYou,
  fetchTrendingProducts,
  fetchPopularProducts,
  fetchRecentProducts,
  fetchReEngage,
  fetchBecauseYouViewed,
  fetchUsersAlsoViewed,
  fetchFrequentlyBoughtTogether,
  fetchSuggestions,
} from "../api/discoveryApi";
import { useAuthStore } from "@/store/authStore";

/**
 * 🎯 For You — Master personalised feed
 * Only fetches when user is logged in.
 * Falls back gracefully on the backend for guests.
 */
export const useForYou = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["for-you", user?._id],
    queryFn: fetchForYou,
    staleTime: 2 * 60 * 1000, // 2 min — personalised so refresh more often
    enabled: !!user, // don't run for guests
  });
};

/**
 * 🔥 Trending — Personalised if logged in, global if guest
 * Backend handles the distinction via optionalAuth.
 */
export const useTrendingProducts = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["trending-products", user?._id], // re-fetches when user logs in
    queryFn: fetchTrendingProducts,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 🏆 Popular — All-time bestsellers
 */
export const usePopularProducts = (params) =>
  useQuery({
    queryKey: ["popular-products", params],
    queryFn: () => fetchPopularProducts(params),
    staleTime: 10 * 60 * 1000, // 10 min — changes slowly
  });

/**
 * 🆕 Recent — Newest arrivals
 */
export const useRecentProducts = () =>
  useQuery({
    queryKey: ["recent-products"],
    queryFn: fetchRecentProducts,
    staleTime: 5 * 60 * 1000,
  });

/**
 * ⏮ Re-Engage — "Viewed but not yet purchased"
 * Only runs when user is logged in.
 */
export const useReEngage = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["re-engage", user?._id],
    queryFn: fetchReEngage,
    staleTime: 2 * 60 * 1000,
    enabled: !!user,
  });
};

/**
 * 👁 Because You Viewed — Similar products to one the user viewed
 * Used on the product detail page.
 * @param {string} productId
 */
export const useBecauseYouViewed = (productId) =>
  useQuery({
    queryKey: ["because-you-viewed", productId],
    queryFn: () => fetchBecauseYouViewed(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

/**
 * 👥 Users Also Viewed — Collaborative filtering
 * Used on the product detail page.
 * @param {string} productId
 */
export const useUsersAlsoViewed = (productId) =>
  useQuery({
    queryKey: ["users-also-viewed", productId],
    queryFn: () => fetchUsersAlsoViewed(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

/**
 * 🛒 Frequently Bought Together — Co-purchase patterns
 * Used on the product detail page.
 * @param {string} productId
 */
export const useFrequentlyBoughtTogether = (productId) =>
  useQuery({
    queryKey: ["frequently-bought", productId],
    queryFn: () => fetchFrequentlyBoughtTogether(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 min — co-purchase data changes slowly
  });

/**
 * 🔍 Smart Suggestions — Autocomplete boosted by user interests
 * Only fires when query length >= 2.
 * @param {string} q - search query
 */
export const useSuggestions = (q) =>
  useQuery({
    queryKey: ["suggestions", q],
    queryFn: () => fetchSuggestions(q),
    enabled: q?.length >= 2,
    staleTime: 30 * 1000, // 30 sec — suggestions should feel fresh
  });
