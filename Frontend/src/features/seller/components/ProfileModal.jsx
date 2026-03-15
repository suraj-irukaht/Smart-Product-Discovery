/**
 * ProfileModal.jsx
 * Props: isOpen, onClose
 */
import { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "@features/seller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Eye, EyeOff, ChevronDown, ChevronUp, User } from "lucide-react";

const EMPTY_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfileModal({ isOpen, onClose }) {
  const { data } = useGetProfile();
  const user = data?.user;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    shopName: "",
    ...EMPTY_PASSWORDS,
  });
  const [showPassSection, setShowPassSection] = useState(false);
  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user)
      setForm((p) => ({
        ...p,
        email: user.email || "",
        phone: user.phone || "",
        shopName: user.shopName || "",
      }));
  }, [user]);

  const { mutate: updateProfile, isPending } = useUpdateProfile(onClose);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (showPassSection) {
      if (!form.currentPassword)
        e.currentPassword = "Current password required";
      if (!form.newPassword) e.newPassword = "New password required";
      if (form.newPassword.length < 8) e.newPassword = "Min 8 characters";
      if (form.newPassword !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      email: form.email,
      phone: form.phone,
      shopName: form.shopName,
    };
    if (showPassSection) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }
    updateProfile(payload);
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggle = (field) => setVisible((p) => ({ ...p, [field]: !p[field] }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        {/* ── Header ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "S"}
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Edit Profile
              </h2>
              <p className="text-xs text-muted-foreground">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Email */}
          <Field label="Email" error={errors.email}>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone">
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+358 40 123 4567"
            />
          </Field>

          {/* Shop Name */}
          <Field label="Shop Name">
            <Input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Your shop name"
            />
          </Field>

          <Separator />

          {/* Password toggle */}
          <button
            type="button"
            onClick={() => {
              setShowPassSection((p) => !p);
              setErrors({});
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            {showPassSection ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Cancel password change
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Change password
              </>
            )}
          </button>

          {/* Password fields */}
          {showPassSection && (
            <div className="space-y-3">
              <Field label="Current Password" error={errors.currentPassword}>
                <PasswordInput
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  visible={visible.current}
                  onToggle={() => toggle("current")}
                  hasError={!!errors.currentPassword}
                />
              </Field>

              <Field label="New Password" error={errors.newPassword}>
                <PasswordInput
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  visible={visible.new}
                  onToggle={() => toggle("new")}
                  hasError={!!errors.newPassword}
                />
              </Field>

              <Field
                label="Confirm New Password"
                error={errors.confirmPassword}
              >
                <PasswordInput
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  visible={visible.confirm}
                  onToggle={() => toggle("confirm")}
                  hasError={!!errors.confirmPassword}
                />
              </Field>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────── */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Field wrapper ──────────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ── Password input with eye toggle ────────────────────────── */
function PasswordInput({ name, value, onChange, visible, onToggle, hasError }) {
  return (
    <div className="relative">
      <Input
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`pr-10 ${hasError ? "border-destructive" : ""}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
