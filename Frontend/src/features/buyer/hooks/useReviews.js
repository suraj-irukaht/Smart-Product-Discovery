import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchReviews, addReview, trackRecentlyViewed } from "../api/reviewApi";

export const useGetReviews = (productId) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
  });

export const useAddReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addReview({ productId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success("Review added!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to add review"),
  });
};

export const useTrackRecentlyViewed = () =>
  useMutation({ mutationFn: trackRecentlyViewed });
