/**
 * useSellerProfile.js
 *
 * TanStack Query hooks for seller profile management.
 *
 * - useGetProfile: fetches current user profile
 * - useUpdateProfile: updates email, phone, shopName, password
 *   Also updates Zustand auth store with new user data on success.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProfile,
  updateProfile,
  fetchSellerOrders,
  updateSellerOrderStatus,
} from "../api/sellerProductApi";

import { useAuthStore } from "@/store/authStore";

import { PAGINATION } from "@/config/config.pagination";

// ─── Query Keys (single source of truth) ──────────────────────────────────
export const sellerProductKeys = {
  all: ["seller-products"],
};

// ─── GET my products ───────────────────────────────────────────────────────
export const useGetMyProducts = (
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
) => {
  return useQuery({
    queryKey: [...sellerProductKeys.all, page, limit],
    queryFn: () => getMyProducts(page, limit),
    placeholderData: (previousData) => previousData,
  });
};

// ─── CREATE product ────────────────────────────────────────────────────────
export const useCreateProduct = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
      toast.success("Product created!");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create product");
    },
  });
};

// ─── UPDATE product ────────────────────────────────────────────────────────
export const useUpdateProduct = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
      toast.success("Product updated!");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update product");
    },
  });
};

// ─── DELETE product ────────────────────────────────────────────────────────
export const useDeleteProduct = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
      toast.success("Product deleted");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    },
  });
};

export const useGetProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

export const useUpdateProfile = (onSuccess) => {
  const queryClient = useQueryClient();
  const { setAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Keep Zustand store in sync
      setAuth(data.user, token);
      toast.success("Profile updated successfully");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useGetSellerOrders = (params) =>
  useQuery({
    queryKey: ["seller-orders", params],
    queryFn: () => fetchSellerOrders(params),
  });

export const useUpdateSellerOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSellerOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      toast.success("Order status updated");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update status"),
  });
};
