import { get } from "@/utils/request";
import api from "@/services/api";

export const fetchNotifications = () => get("/admin/notifications");

export const markAllRead = () =>
  api.patch("/admin/notifications/read-all").then((r) => r.data);

export const markOneRead = (id) =>
  api.patch(`/admin/notifications/${id}/read`).then((r) => r.data);
