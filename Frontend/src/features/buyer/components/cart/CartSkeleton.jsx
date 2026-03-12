/**
 * CartSkeleton.jsx
 *
 * Loading skeleton for CartPage.
 * Mirrors the layout of cart items + summary panel.
 */
export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-32 bg-slate-200 rounded-xl mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-slate-100 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 animate-pulse"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/4 mt-2" />
                </div>
                <div className="flex flex-col items-end gap-2 py-1">
                  <div className="h-4 bg-slate-100 rounded w-16" />
                  <div className="h-8 bg-slate-100 rounded-xl w-24" />
                  <div className="h-3 bg-slate-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 h-72 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
