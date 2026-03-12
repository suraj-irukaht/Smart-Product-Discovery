import { get } from "@/utils/request";

export const fetchPopularProducts = (params) =>
  get(`/products/popular?${new URLSearchParams(params)}`);
export const fetchTrendingProducts = () => get("/products/trending");
export const fetchRecentProducts = () => get("/products/recent");
export const fetchRecommendedProducts = () => get("/products/recommended");
export const fetchRecentlyViewed = () => get("/products/recently-viewed");
export const fetchSuggestions = (q) => get(`/products/suggestions?q=${q}`);
