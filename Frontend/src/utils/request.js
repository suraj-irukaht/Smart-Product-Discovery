import api from "@/services/api";

export async function request(config) {
  const res = await api(config);
  return res.data;
}

// Convenience methods (optional)
export const get = (url, params) => request({ url, method: "GET", params });
export const post = (url, data) => request({ url, method: "POST", data });
export const put = (url, data) => request({ url, method: "PUT", data });
export const del = (url) => request({ url, method: "DELETE" });
