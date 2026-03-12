import { get } from "@/utils/request";
import api from "@/services/api";

export const createOrder = () =>
  api.post("/orders/checkout").then((r) => r.data);
export const fetchOrders = (params) =>
  get(`/orders?${new URLSearchParams(params)}`);
export const cancelOrder = (orderId) =>
  api.patch(`/orders/${orderId}/cancel`).then((r) => r.data);
