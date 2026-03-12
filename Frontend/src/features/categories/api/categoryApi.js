import { request } from "@/utils/request";

export const fetchCategory = async () => {
  return request({
    url: "/categories",
    method: "GET",
  });
};
