/**
 * ActiveFilterChips.jsx
 *
 * Displays removable chips for each active filter.
 * Shows result count on the left, chips on the right.
 *
 * Props:
 * - total          : number
 * - isLoading      : boolean
 * - search         : string
 * - category       : string
 * - minPrice       : string
 * - maxPrice       : string
 * - categories     : array
 * - onRemoveSearch   : () => void
 * - onRemoveCategory : () => void
 * - onRemovePrice    : () => void
 * - onOpenSidebar    : () => void  (mobile)
 */
export default function ActiveFilterChips({
  total,
  isLoading,
  search,
  category,
  minPrice,
  maxPrice,
  categories,
  onRemoveSearch,
  onRemoveCategory,
  onRemovePrice,
  onOpenSidebar,
}) {
  return (
    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        {/* Mobile filter toggle */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
        >
          ⚙️ Filters
        </button>

        {/* Result count */}
        <p className="text-sm text-slate-500">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <span className="font-bold text-slate-800">{total}</span> products
              found
            </>
          )}
        </p>
      </div>

      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {search && <Chip label={`"${search}"`} onRemove={onRemoveSearch} />}
        {category && (
          <Chip
            label={
              categories.find((c) => c._id === category)?.name ?? "Category"
            }
            onRemove={onRemoveCategory}
          />
        )}
        {(minPrice || maxPrice) && (
          <Chip
            label={`$${minPrice || "0"} – $${maxPrice || "∞"}`}
            onRemove={onRemovePrice}
          />
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-indigo-900 cursor-pointer leading-none"
      >
        ✕
      </button>
    </span>
  );
}
