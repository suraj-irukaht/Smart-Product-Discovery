import { get } from "@/utils/request";
import api from "@/services/api";

export const fetchAdminStats = () => get("/admin/stats");
export const fetchAdminCharts = () => get("/admin/charts");
export const fetchAllOrders = (page = 1, limit = 7) =>
  get(`/admin/orders?page=${page}&limit=${limit}`);

export const fetchOrderDetails = (orderId) => get(`/admin/orders/${orderId}`);

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/admin/orders/${orderId}/status`, { status }).then((r) => r.data);

export const fetchUsersByRole = (role, page = 1) =>
  get(`/admin/users/${role}?page=${page}`);

export const toggleLockUser = (userId) =>
  api.patch(`/admin/users/${userId}/lock`).then((r) => r.data);

export const fetchAllProducts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.minPrice) query.set("minPrice", params.minPrice);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);
  if (params.sort) query.set("sort", params.sort);
  return get(`/products?${query.toString()}`);
};

export const toggleProductStatus = (productId) =>
  api.patch(`/admin/products/${productId}/status`).then((r) => r.data);

export const deleteProductByAdmin = (productId) =>
  api.delete(`/admin/products/${productId}`).then((r) => r.data);

export const createCategory = (data) =>
  api.post("/categories/create", data).then((r) => r.data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then((r) => r.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data);
