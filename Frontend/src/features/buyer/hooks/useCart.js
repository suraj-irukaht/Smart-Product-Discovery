/**
 * useCart.js
 *
 * TanStack Query hooks for cart operations.
 *
 * - useGetCart: fetches current user's cart with populated products + total
 * - useAddToCart: adds or increments a product in cart
 * - useUpdateCartItem: updates quantity of a cart item
 * - useRemoveCartItem: removes a product from cart
 *
 * All mutations invalidate ["cart"] query key and show toast feedback.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";
import { useAuthStore } from "@/store/authStore";

export const useGetCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    gcTime: 0,
    retry: false, // ← don't retry, let interceptor handle 401
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to add to cart"),
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update cart"),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed");
    },
    onError: () => toast.error("Failed to remove item"),
  });
};
