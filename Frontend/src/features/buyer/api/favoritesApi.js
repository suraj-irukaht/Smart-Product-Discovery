import { get } from "@/utils/request";
import api from "@/services/api";

export const fetchFavorites = (params) =>
  get(`/favorites?${new URLSearchParams(params)}`);
export const addFavorite = (productId) =>
  api.post(`/favorites/${productId}`).then((r) => r.data);
export const removeFavorite = (productId) =>
  api.delete(`/favorites/${productId}`).then((r) => r.data);
