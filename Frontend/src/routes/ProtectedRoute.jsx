import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuthStore();

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role → redirect to their correct home
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "SELLER") return <Navigate to="/seller" replace />;
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
