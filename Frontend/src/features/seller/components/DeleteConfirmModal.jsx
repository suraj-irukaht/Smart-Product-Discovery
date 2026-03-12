export default function DeleteConfirmModal({ onCancel, onConfirm, loading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 text-center"
        style={{
          backgroundColor: "var(--color-card)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <p className="text-3xl mb-3">🗑️</p>
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: "var(--color-foreground)" }}
        >
          Delete Product?
        </h3>
        <p
          className="text-sm mb-5"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg py-2 text-sm font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
            style={{
              backgroundColor: "var(--color-destructive)",
              color: "var(--color-destructive-foreground)",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
