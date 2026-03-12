/* ───────────── LOADING ───────────── */

export default function LoadingSpinner() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center rounded-xl"
      style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
    >
      <svg
        className="animate-spin h-10 w-10 text-blue-600 mb-3"
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
      <p className="text-xs text-gray-400 mt-1">Please wait...</p>
    </div>
  );
}
