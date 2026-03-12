/**
 * ProductsSidebar.jsx
 *
 * Sidebar filter panel for ProductsPage.
 * Contains: search, category, price range, sort filters.
 * All filters update URL params immediately via updateParam / handlePriceBlur.
 *
 * Props:
 * - search, category, sort, priceMin, priceMax  : current filter values
 * - categories                                  : array of category objects
 * - hasActiveFilters                            : boolean
 * - updateParam      : (key, value) => void
 * - handleReset      : () => void
 * - handlePriceBlur  : () => void
 * - setPriceMin      : (v) => void
 * - setPriceMax      : (v) => void
 */

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function ProductsSidebar({
  search,
  category,
  sort,
  priceMin,
  priceMax,
  categories,
  updateParam,
  handlePriceBlur,
  setPriceMin,
  setPriceMax,
}) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <FilterGroup label="Search">
        <input
          placeholder="Search products..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("search", e.target.value.trim());
          }}
          onBlur={(e) => updateParam("search", e.target.value.trim())}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 placeholder-slate-400"
        />
        <p className="text-xs text-slate-400 mt-1.5">Press Enter to search</p>
      </FilterGroup>

      <Divider />

      {/* Category */}
      <FilterGroup label="Category">
        <div className="space-y-0.5">
          <FilterButton
            label="All Categories"
            active={!category}
            onClick={() => updateParam("category", "")}
          />
          {categories.map((c) => (
            <FilterButton
              key={c._id}
              label={c.name}
              active={category === c._id}
              onClick={() => updateParam("category", c._id)}
            />
          ))}
        </div>
      </FilterGroup>

      <Divider />

      {/* Price Range */}
      <FilterGroup label="Price Range">
        <div className="space-y-2">
          <PriceInput
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => e.key === "Enter" && handlePriceBlur()}
          />
          <PriceInput
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => e.key === "Enter" && handlePriceBlur()}
          />
          <p className="text-xs text-slate-400">Press Enter to apply</p>
        </div>
      </FilterGroup>

      <Divider />

      {/* Sort */}
      <FilterGroup label="Sort By">
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((o) => (
            <FilterButton
              key={o.value}
              label={o.label}
              active={sort === o.value}
              onClick={() => updateParam("sort", o.value)}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────── */

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between capitalize ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span>{label}</span>
      {active && (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 opacity-80"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

function PriceInput({ placeholder, value, onChange, onBlur, onKeyDown }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
        $
      </span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white transition-colors"
      />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100" />;
}
