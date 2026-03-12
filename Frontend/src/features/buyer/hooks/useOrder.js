import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOrder, fetchOrders, cancelOrder } from "../api/orderApi";

export const useGetOrders = (params) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
  });

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to place order"),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to cancel order"),
  });
};
