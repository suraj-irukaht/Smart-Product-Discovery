import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../api/favoritesApi";

export const useGetFavorites = (params) =>
  useQuery({
    queryKey: ["favorites", params],
    queryFn: () => fetchFavorites(params),

    gcTime: 0,
  });

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { mutate: add } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Added to favourites");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });
  const { mutate: remove } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed from favourites");
    },
    onError: () => toast.error("Failed to remove"),
  });

  return { add, remove };
};
