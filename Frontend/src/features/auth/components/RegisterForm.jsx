import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister, getPasswordStrength } from "../hooks/useAuth";

export default function RegisterForm({ role = "BUYER" }) {
  const isSeller = role === "SELLER";
  const { handleRegister, loading } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    shopName: "", // only used when role === "SELLER"
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(form, role);
  };

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all " +
    "focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]";

  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{
          backgroundColor: "var(--color-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* ── Header — changes based on role ── */}
        <div className="mb-6 text-center">
          {isSeller && (
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="text-xl">🏪</span>
            </div>
          )}
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--color-foreground)" }}
          >
            {isSeller ? "Become a Seller" : "Create an account"}
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {isSeller
              ? "Start selling on Smart Discovery"
              : "Start your journey today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-foreground)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Email */}
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
              style={inputStyle}
            />
          </div>

          {/* Shop Name — SELLER only */}
          {isSeller && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-foreground)" }}
              >
                Shop Name
                <span
                  className="ml-1 text-xs font-normal"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  (visible to buyers)
                </span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  🏪
                </span>
                <input
                  type="text"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="My Awesome Shop"
                  className={inputClass + " pl-8"}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-foreground)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className={inputClass + " pr-12"}
                style={inputStyle}
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

            {/* Strength bar */}
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    Uppercase, number, special character
                  </p>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.score <= 1
                        ? "text-red-500"
                        : passwordStrength.score === 2
                          ? "text-orange-400"
                          : passwordStrength.score === 3
                            ? "text-yellow-500"
                            : "text-green-500"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-foreground)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={inputClass + " pr-12"}
                style={{
                  ...inputStyle,
                  borderColor:
                    form.confirmPassword &&
                    form.confirmPassword !== form.password
                      ? "var(--color-destructive)"
                      : form.confirmPassword &&
                          form.confirmPassword === form.password
                        ? "var(--color-success)"
                        : "var(--color-border)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p className="mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
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
                {isSeller
                  ? "Creating seller account..."
                  : "Creating account..."}
              </span>
            ) : isSeller ? (
              "Create Seller Account"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
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

        {/* Footer links */}
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Sign in
          </Link>
        </p>

        {/* Cross-role link */}
        <p
          className="text-center text-sm mt-2"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          {isSeller ? (
            <>
              Want to shop instead?{" "}
              <Link
                to="/register"
                className="font-medium hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Buyer registration
              </Link>
            </>
          ) : (
            <>
              Want to sell?{" "}
              <Link
                to="/seller/register"
                className="font-medium hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Seller registration
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
