/**
 * ForgotPasswordPage.jsx
 * Route: /forgot-password
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-background" />
          </div>
        </div>

        {submitted ? (
          /* ── Success state ─────────────────────────── */
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                If <span className="font-medium text-foreground">{email}</span>{" "}
                is registered, we've sent a password reset link. Check your spam
                folder too.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              The link expires in 1 hour.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full gap-2 mt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign in
              </Button>
            </Link>
          </div>
        ) : (
          /* ── Form ──────────────────────────────────── */
          <>
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-foreground">
                Forgot password?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <Separator className="my-5" />

            <Link to="/login">
              <Button
                variant="ghost"
                className="w-full gap-2 text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign in
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
