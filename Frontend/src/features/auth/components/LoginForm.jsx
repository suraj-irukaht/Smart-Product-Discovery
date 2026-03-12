import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { handleLogin, loading } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(form, () => navigate("/"));
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-foreground)] bg-[var(--color-background)] placeholder-[var(--color-muted-foreground)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{
          backgroundColor: "var(--color-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-6 text-center">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--color-foreground)" }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-foreground)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-foreground)" }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <span
            className="text-xs"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        <p
          className="text-center text-sm"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
