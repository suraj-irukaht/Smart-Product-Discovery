import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  },
);

export default api;
