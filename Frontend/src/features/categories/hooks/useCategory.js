import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "../api/categoryApi";

export default function useProducts() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory,
  });
}
