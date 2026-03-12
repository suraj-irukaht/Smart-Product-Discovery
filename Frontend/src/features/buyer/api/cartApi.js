/**
 * cartApi.js
 *
 * API service functions for cart operations.
 * Base route: /api/cart
 *
 * Endpoints:
 * - GET    /cart            → fetch user cart
 * - POST   /cart            → add item { product_id, quantity }
 * - PATCH  /cart/:productId → update quantity
 * - DELETE /cart/:productId → remove item
 */
import { get } from "@/utils/request";
import api from "@/services/api";

export const fetchCart = () => get("/cart");
export const addToCart = (data) => api.post("/cart", data).then((r) => r.data);
export const updateCartItem = (productId, quantity) =>
  api.patch(`/cart/${productId}`, { quantity }).then((r) => r.data);
export const removeCartItem = (productId) =>
  api.delete(`/cart/${productId}`).then((r) => r.data);
