/**
 * PreferencesModal.jsx
 * Props: isOpen, onClose
 */
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetBuyerProfile,
  useUpdateBuyerProfile,
} from "../../hooks/useBuyer";
import useCategories from "@/features/categories/hooks/useCategory";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Check } from "lucide-react";

const CAT_COLORS = [
  {
    bg: "bg-violet-50  dark:bg-violet-950",
    text: "text-violet-600",
    active: "bg-violet-600  border-violet-600  text-white",
  },
  {
    bg: "bg-rose-50    dark:bg-rose-950",
    text: "text-rose-600",
    active: "bg-rose-600    border-rose-600    text-white",
  },
  {
    bg: "bg-amber-50   dark:bg-amber-950",
    text: "text-amber-600",
    active: "bg-amber-600   border-amber-600   text-white",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    text: "text-emerald-600",
    active: "bg-emerald-600 border-emerald-600 text-white",
  },
  {
    bg: "bg-sky-50     dark:bg-sky-950",
    text: "text-sky-600",
    active: "bg-sky-600     border-sky-600     text-white",
  },
  {
    bg: "bg-pink-50    dark:bg-pink-950",
    text: "text-pink-600",
    active: "bg-pink-600    border-pink-600    text-white",
  },
  {
    bg: "bg-orange-50  dark:bg-orange-950",
    text: "text-orange-600",
    active: "bg-orange-600  border-orange-600  text-white",
  },
  {
    bg: "bg-teal-50    dark:bg-teal-950",
    text: "text-teal-600",
    active: "bg-teal-600    border-teal-600    text-white",
  },
  {
    bg: "bg-indigo-50  dark:bg-indigo-950",
    text: "text-indigo-600",
    active: "bg-indigo-600  border-indigo-600  text-white",
  },
  {
    bg: "bg-lime-50    dark:bg-lime-950",
    text: "text-lime-600",
    active: "bg-lime-600    border-lime-600    text-white",
  },
];

export default function PreferencesModal({ isOpen, onClose }) {
  const { data: profileData } = useGetBuyerProfile();
  const { data: catData } = useCategories();
  const { mutate: update, isPending } = useUpdateBuyerProfile();
  const queryClient = useQueryClient();

  // ✅ Only setAuth exists on this store
  const { user, token, setAuth } = useAuthStore();

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
  const selectAll = () => setSelected(categories.map((c) => c._id));
  const clearAll = () => setSelected([]);

  const handleSave = () => {
    update(
      { preferences: selected },
      {
        onSuccess: () => {
          // ✅ Update Zustand with setAuth — preserves token
          setAuth({ ...user, preferences: selected }, token);

          // Invalidate personalised feed queries so they re-fetch immediately
          queryClient.invalidateQueries({ queryKey: ["for-you"] });
          queryClient.invalidateQueries({ queryKey: ["trending-products"] });
          queryClient.invalidateQueries({ queryKey: ["re-engage"] });

          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Your Preferences
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selected.length === 0
                  ? "Pick at least one category"
                  : `${selected.length} of ${categories.length} selected`}
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
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Pick categories you love — we'll personalise your feed.
            </p>
            <div className="flex gap-2 shrink-0 ml-3">
              <button
                onClick={selectAll}
                className="text-xs font-medium text-foreground hover:underline"
              >
                All
              </button>
              <span className="text-muted-foreground text-xs">·</span>
              <button
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => {
              const { active, bg, text } = CAT_COLORS[i % CAT_COLORS.length];
              const isActive = selected.includes(c._id);
              return (
                <button
                  key={c._id}
                  onClick={() => toggle(c._id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
                    border-2 transition-all duration-150 cursor-pointer
                    ${
                      isActive
                        ? active
                        : `${bg} ${text} border-transparent hover:border-current`
                    }
                  `}
                >
                  {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                  <span className="capitalize">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isPending || selected.length === 0}
          >
            {isPending ? "Saving…" : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
