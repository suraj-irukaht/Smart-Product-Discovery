/**
 * ResetPasswordPage.jsx
 * Route: /reset-password?token=xxx
 */
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getPasswordStrength } from "@features/auth/hooks/useAuth";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(form.password);
  const mismatch = form.confirm && form.confirm !== form.password;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleVisible = (f) => setVisible((p) => ({ ...p, [f]: !p[f] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password) {
      toast.error("Password is required");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Min 8 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: form.password,
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Try requesting a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── No token in URL ──────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Invalid link</h2>
          <p className="text-sm text-muted-foreground">
            This reset link is missing or malformed.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full">Request a new link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-background" />
          </div>
        </div>

        {done ? (
          /* ── Success ─────────────────────────────────── */
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Password updated!
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting you to sign in…
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full mt-2">Sign in now</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-foreground">
                Set new password
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a strong password for your account
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={visible.password ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => toggleVisible("password")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {visible.password ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
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
                            i <= strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">
                        Uppercase, number, special character
                      </p>
                      <span
                        className={`text-xs font-semibold ${
                          strength.score <= 1
                            ? "text-red-500"
                            : strength.score === 2
                              ? "text-orange-400"
                              : strength.score === 3
                                ? "text-yellow-500"
                                : "text-emerald-500"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    name="confirm"
                    type={visible.confirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`pr-10 ${mismatch ? "border-destructive" : form.confirm && !mismatch ? "border-emerald-500" : ""}`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => toggleVisible("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {visible.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {mismatch && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating…
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>

            <Separator className="my-5" />

            <p className="text-center text-sm text-muted-foreground">
              Remember it?{" "}
              <Link
                to="/login"
                className="font-semibold text-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
