import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "../api/productApi";

import { PAGINATION } from "@/config/config.pagination";

export function useProducts(
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(page, limit),
    placeholderData: (previousData) => previousData,
  });
}

export function useProductById(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}
