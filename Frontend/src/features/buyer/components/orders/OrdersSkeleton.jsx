/**
 * OrdersSkeleton.jsx
 *
 * Loading skeleton for OrdersPage.
 * Mirrors the layout of OrderCard.
 */
export default function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-7 w-24 bg-slate-100 rounded-full" />
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-6 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-9 w-32 bg-slate-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
