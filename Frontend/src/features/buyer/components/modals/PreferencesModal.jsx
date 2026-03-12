/**
 * PreferencesModal.jsx
 *
 * Lets the buyer select their preferred product categories.
 * Selections are saved to user profile via PUT /api/users/profile.
 * On save, Zustand auth store is updated so preferences are reflected immediately.
 *
 * Props: isOpen, onClose
 * Depends on: useGetBuyerProfile, useUpdateBuyerProfile, useCategories
 */
import { useState, useEffect } from "react";
import {
  useGetBuyerProfile,
  useUpdateBuyerProfile,
} from "../../hooks/useBuyer";
import useCategories from "@/features/categories/hooks/useCategory";

export default function PreferencesModal({ isOpen, onClose }) {
  const { data: profileData } = useGetBuyerProfile();
  const { data: catData } = useCategories();
  const { mutate: update, isPending } = useUpdateBuyerProfile();

  const categories = catData?.categories ?? [];
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (profileData?.user?.preferences) {
      setSelected(profileData.user.preferences.map((p) => p._id || p));
    }
  }, [profileData]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSave = () =>
    update({ preferences: selected }, { onSuccess: onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-slate-900">
            Your Preferences
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Pick categories you're interested in — we'll personalise your feed.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => {
            const active = selected.includes(c._id);
            return (
              <button
                key={c._id}
                onClick={() => toggle(c._id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 cursor-pointer transition-colors"
          >
            {isPending ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
