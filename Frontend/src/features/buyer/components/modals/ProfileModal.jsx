/**
 * BuyerProfileModal.jsx
 * Props: isOpen, onClose
 */
import { useState, useEffect } from "react";
import {
  useGetBuyerProfile,
  useUpdateBuyerProfile,
} from "@features/buyer/hooks/useBuyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

const EMPTY_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function BuyerProfileModal({ isOpen, onClose }) {
  const { data } = useGetBuyerProfile();
  const user = data?.user;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
  }, [user]);

  const { mutate: updateProfile, isPending } = useUpdateBuyerProfile();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
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
    const payload = { name: form.name, email: form.email, phone: form.phone };
    if (showPassSection) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }
    updateProfile(payload, { onSuccess: onClose });
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleVisible = (f) => setVisible((p) => ({ ...p, [f]: !p[f] }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "B"}
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Edit Profile
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <Field label="Full Name" error={errors.name}>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={errors.name ? "border-destructive" : ""}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
          </Field>

          <Field label="Phone">
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+358 40 123 4567"
            />
          </Field>

          <Separator />

          <button
            type="button"
            onClick={() => {
              setShowPassSection((p) => !p);
              setErrors({});
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
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

          {showPassSection && (
            <div className="space-y-3">
              <Field label="Current Password" error={errors.currentPassword}>
                <PasswordInput
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  visible={visible.current}
                  onToggle={() => toggleVisible("current")}
                  hasError={!!errors.currentPassword}
                />
              </Field>
              <Field label="New Password" error={errors.newPassword}>
                <PasswordInput
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  visible={visible.new}
                  onToggle={() => toggleVisible("new")}
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
                  onToggle={() => toggleVisible("confirm")}
                  hasError={!!errors.confirmPassword}
                />
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
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
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
