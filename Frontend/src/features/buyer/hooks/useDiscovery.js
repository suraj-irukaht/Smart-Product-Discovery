import { useQuery } from "@tanstack/react-query";
import {
  fetchPopularProducts,
  fetchTrendingProducts,
  fetchRecentProducts,
  fetchRecommendedProducts,
  fetchRecentlyViewed,
  fetchSuggestions,
} from "../api/discoveryApi";

export const usePopularProducts = (params) =>
  useQuery({
    queryKey: ["popular-products", params],
    queryFn: () => fetchPopularProducts(params),
  });

export const useTrendingProducts = () =>
  useQuery({
    queryKey: ["trending-products"],
    queryFn: fetchTrendingProducts,
    staleTime: 5 * 60 * 1000,
  });

export const useRecentProducts = () =>
  useQuery({
    queryKey: ["recent-products"],
    queryFn: fetchRecentProducts,
    staleTime: 5 * 60 * 1000,
  });

export const useRecommendedProducts = () =>
  useQuery({
    queryKey: ["recommended-products"],
    queryFn: fetchRecommendedProducts,
  });

export const useRecentlyViewed = () =>
  useQuery({ queryKey: ["recently-viewed"], queryFn: fetchRecentlyViewed });

export const useSuggestions = (q) =>
  useQuery({
    queryKey: ["suggestions", q],
    queryFn: () => fetchSuggestions(q),
    enabled: q?.length >= 2,
  });
