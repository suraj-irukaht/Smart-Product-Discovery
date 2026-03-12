import { post } from "@/utils/request";

// POST /api/auth/login
export const login = (data) => post("/auth/login", data);

// POST /api/auth/register        → BUYER (role set by backend)
// POST /api/auth/seller/register → SELLER (role set by backend)
export const register = (data, path = "/auth/register") => post(path, data);

// POST /api/auth/logout
export const logout = () => post("/auth/logout");
