/**
 * sellerApi.js
 *
 * API service functions for seller profile operations.
 * Uses the shared axios instance with credentials.
 */

import { get, del } from "@/utils/request";
import api from "@/services/api";

export const createProduct = (formData) =>
  api.post("/products/seller/create", formData).then((r) => r.data);

export const getMyProducts = (page, limit) =>
  get(`/products/seller/my-products?page=${page}&limit=${limit}`);

export const updateProduct = (id, formData) =>
  api.put(`products/seller/update/${id}`, formData).then((r) => r.data);

export const deleteProduct = (id) => del(`products/seller/delete/${id}`);

export const getProfile = () => get("/users/profile");

export const updateProfile = (data) =>
  api.put("/users/profile", data).then((r) => r.data);

export const fetchSellerOrders = (params) =>
  api.get(`/orders/seller?${new URLSearchParams(params)}`).then((r) => r.data);

export const updateSellerOrderStatus = ({ orderId, status }) =>
  api.patch(`/orders/seller/${orderId}/status`, { status }).then((r) => r.data);
