/**
 * ProfileModal.jsx
 *
 * Modal for sellers to update their profile information.
 * Fields: email, phone, shopName, and optional password change.
 * Pre-populates form with current user data from the profile query.
 * Shows password fields only when user wants to change password.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */
import { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "@features/seller";

export default function ProfileModal({ isOpen, onClose }) {
  const { data } = useGetProfile();
  const user = data?.user;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    shopName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-populate form when profile loads
  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        email: user.email || "",
        phone: user.phone || "",
        shopName: user.shopName || "",
      }));
    }
  }, [user]);

  const { mutate: updateProfile, isPending } = useUpdateProfile(onClose);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (showPassword) {
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

    if (showPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    updateProfile(payload);
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (!isOpen) return null;

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="rounded-xl w-full max-w-md mx-4 overflow-hidden"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h2
              className="font-semibold text-base"
              style={{ color: "var(--color-foreground)" }}
            >
              Edit Profile
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {user?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-70"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-foreground)" }}
            >
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-foreground)" }}
            >
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+358 40 123 4567"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Shop Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-foreground)" }}
            >
              Shop Name
            </label>
            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Your shop name"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Password toggle */}
          <div>
            <button
              type="button"
              onClick={() => {
                setShowPassword((p) => !p);
                setErrors({});
              }}
              className="text-sm font-medium hover:opacity-80"
              style={{ color: "var(--color-primary)" }}
            >
              {showPassword ? "▲ Cancel password change" : "▼ Change password"}
            </button>
          </div>

          {/* Password fields */}
          {showPassword && (
            <div className="space-y-3 pt-1">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.currentPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 justify-end px-6 py-4 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
