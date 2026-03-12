import api from "@/services/api";
import { get } from "@/utils/request";

export const fetchReviews = (productId) =>
  get(`/products/${productId}/reviews`);
export const addReview = ({ productId, rating, comment }) =>
  api
    .post(`/products/${productId}/review`, { rating, comment })
    .then((r) => r.data);

export const trackRecentlyViewed = (productId) =>
  api.get(`/products/${productId}/recently-viewed`).then((r) => r.data);
