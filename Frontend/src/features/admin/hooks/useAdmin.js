import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchAdminStats,
  fetchAllOrders,
  fetchOrderDetails,
  updateOrderStatus,
  fetchUsersByRole,
  toggleLockUser,
  fetchAllProducts,
  toggleProductStatus,
  deleteProductByAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/adminApi";

export const useAdminStats = () =>
  useQuery({ queryKey: ["admin-stats"], queryFn: fetchAdminStats });

export const useAllProducts = (params = {}) =>
  useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => fetchAllProducts(params),
    placeholderData: (prev) => prev,
  });

export const useAllOrders = (page = 1, limit = PAGINATION.DEFAULT_LIMIT) =>
  useQuery({
    queryKey: ["admin-orders", page, limit],
    queryFn: () => fetchAllOrders(page, limit),
    placeholderData: (prev) => prev,
  });

export const useOrderDetails = (orderId) =>
  useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });
};

export const useUsersByRole = (role, page = 1) =>
  useQuery({
    queryKey: ["admin-users", role, page],
    queryFn: () => fetchUsersByRole(role, page),
    placeholderData: (prev) => prev,
  });

export const useToggleLockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => toggleLockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update user"),
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => toggleProductStatus(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product status updated");
    },
    onError: () => toast.error("Failed to update product"),
  });
};

export const useDeleteProductByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => deleteProductByAdmin(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create"),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update"),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: () => toast.error("Failed to delete category"),
  });
};
