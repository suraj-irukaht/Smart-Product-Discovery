import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { getBuyerProfile, updateBuyerProfile } from "../api/buyerApi";

export const useGetBuyerProfile = () =>
  useQuery({ queryKey: ["buyer-profile"], queryFn: getBuyerProfile });

export const useUpdateBuyerProfile = () => {
  const queryClient = useQueryClient();
  const { setAuth, token } = useAuthStore();
  return useMutation({
    mutationFn: updateBuyerProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
      setAuth(data.user, token);
      toast.success("Profile updated");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update profile"),
  });
};
