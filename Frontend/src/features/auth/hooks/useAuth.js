import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login, register, logout, reset, forgot } from "../api/authApi";
import { useAuthStore } from "@/store/authStore";

export const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= PASSWORD_RULES.minLength) score++;
  if (PASSWORD_RULES.hasUppercase.test(password)) score++;
  if (PASSWORD_RULES.hasNumber.test(password)) score++;
  if (PASSWORD_RULES.hasSpecial.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-green-500" };
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!PASSWORD_RULES.hasUppercase.test(password))
    return "Must include an uppercase letter";
  if (!PASSWORD_RULES.hasNumber.test(password)) return "Must include a number";
  if (!PASSWORD_RULES.hasSpecial.test(password))
    return "Must include a special character";
  return null;
};

// ── Login ────────────────────────────────────────────────────
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await login(data);
      setAuth(result.user, result.token);
      toast.success("Welcome back!");
      if (result.user.role === "SELLER") navigate("/seller");
      else if (result.user.role === "ADMIN") navigate("/admin");
      else navigate("/");
    } finally {
      setLoading(false);
    }
  };
  return { handleLogin, loading };
};

// ── Register ─────────────────────────────────────────────────
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data, role = "BUYER") => {
    const isSeller = role === "SELLER";

    if (!data.name || !data.email || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isSeller && !data.shopName) {
      toast.error("Shop name is required");
      return;
    }
    const err = validatePassword(data.password);
    if (err) {
      toast.error(err);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const endpoint = isSeller ? "/auth/seller/register" : "/auth/register";
      await register(payload, endpoint);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  return { handleRegister, loading };
};

// ── Logout ───────────────────────────────────────────────────
export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out");
    navigate("/");
  };
  return { handleLogout };
};

// ── Forgot password ──────────────────────────────────────────
export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const handleForgot = async (email, onSuccess) => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await forgot({ email });
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { handleForgot, loading };
};

// ── Reset password ───────────────────────────────────────────
export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async ({ token, password, confirm }, onSuccess) => {
    if (!password) {
      toast.error("Password is required");
      return;
    }
    const err = validatePassword(password);
    if (err) {
      toast.error(err);
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await reset({ token, password });
      toast.success("Password updated! Please sign in.");
      onSuccess?.();
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid or expired reset link",
      );
    } finally {
      setLoading(false);
    }
  };
  return { handleReset, loading };
};
