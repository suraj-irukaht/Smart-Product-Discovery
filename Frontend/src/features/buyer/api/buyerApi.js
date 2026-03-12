import { get } from "@/utils/request";
import api from "@/services/api";

export const getBuyerProfile = () => get("/users/profile");
export const updateBuyerProfile = (data) =>
  api.put("/users/profile", data).then((r) => r.data);
