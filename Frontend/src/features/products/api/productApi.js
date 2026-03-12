import { get } from "@/utils/request";

export const fetchProducts = (page, limit) =>
  get(`/products?page=${page}&limit=${limit}`, data);

export const fetchProductById = (id) => get(`/products/${id}`);
