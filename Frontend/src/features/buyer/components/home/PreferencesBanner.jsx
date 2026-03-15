/**
 * PreferencesBanner.jsx
 * Props: onOpen
 */
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PreferencesBanner({ onOpen }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Personalise your feed
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            Pick your favourite categories to get tailored recommendations
          </p>
        </div>
      </div>
      <Button
        onClick={onOpen}
        size="sm"
        className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0"
      >
        Set Preferences
      </Button>
    </div>
  );
}
