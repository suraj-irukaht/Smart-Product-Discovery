/**
 * PreferencesBanner.jsx
 *
 * Shown when the buyer has no preferences set.
 * Prompts them to set preferences for personalised recommendations.
 *
 * Props:
 * - onOpen: () => void  — opens PreferencesModal
 */
export default function PreferencesBanner({ onOpen }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-sm font-bold text-amber-800">
            Personalise your feed
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Pick your favourite categories to get tailored recommendations
          </p>
        </div>
      </div>
      <button
        onClick={onOpen}
        className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
      >
        Set Preferences
      </button>
    </div>
  );
}
