import { get } from "@/utils/request";

// ── Core personalised feed ────────────────────────────────────
export const fetchForYou = () => get("/discovery/for-you");

// ── Trending & Popular ────────────────────────────────────────
export const fetchTrendingProducts = () => get("/discovery/trending");
export const fetchPopularProducts = (params) =>
  get(`/discovery/popular?${new URLSearchParams(params)}`);

// ── New arrivals ──────────────────────────────────────────────
export const fetchRecentProducts = () => get("/discovery/recent");

// ── Re-engagement ─────────────────────────────────────────────
export const fetchReEngage = () => get("/discovery/re-engage");

// ── Product-level discovery (used on product detail page) ─────
export const fetchBecauseYouViewed = (productId) =>
  get(`/discovery/because-you-viewed/${productId}`);

export const fetchUsersAlsoViewed = (productId) =>
  get(`/discovery/users-also-viewed/${productId}`);

export const fetchFrequentlyBoughtTogether = (productId) =>
  get(`/discovery/frequently-bought/${productId}`);

// ── Smart autocomplete ────────────────────────────────────────
export const fetchSuggestions = (q) =>
  get(`/discovery/suggestions?q=${encodeURIComponent(q)}`);
