// /**
//  * SearchBar.jsx
//  *
//  * Reusable search bar with autocomplete suggestions.
//  * On submit or suggestion click → navigates to /products?search=query.
//  *
//  * Props:
//  * - defaultValue : string  — pre-fills input (used on ProductsPage from URL)
//  * - variant      : "hero" | "sidebar"  — controls styling
//  * - onSearch     : (value) => void  — optional callback after navigate
//  */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSuggestions } from "@features/buyer/hooks/useDiscovery";

export default function SearchBar({
  defaultValue = "",
  variant = "hero",
  onSearch,
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(defaultValue);
  const [showSugg, setShowSugg] = useState(false);
  const inputRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({});

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const { data: suggData } = useSuggestions(value);
  const suggestions = suggData?.suggestions ?? [];

  const go = (query) => {
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    onSearch?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSugg(false);
    go(value);
  };

  const handlePick = (s) => {
    setValue(s);
    setShowSugg(false);
    go(s);
  };

  // Calculate dropdown position for sidebar (fixed positioning to escape overflow clip)
  const handleFocus = () => {
    if (variant === "sidebar" && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setShowSugg(true);
  };

  if (variant === "sidebar") {
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Search
        </p>
        <div className="relative">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSugg(true);
            }}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            placeholder="Search products..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 placeholder-slate-400"
          />

          {/* Fixed dropdown — escapes overflow:hidden of sidebar */}
          {showSugg && suggestions.length > 0 && (
            <div
              style={{
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 9999,
              }}
              className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => handlePick(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="text-slate-300 text-xs">🔍</span> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Press Enter to search</p>
      </div>
    );
  }

  // variant === "hero"
  return (
    <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSugg(true);
            }}
            onFocus={() => setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder="Search products, brands..."
            className="w-full px-5 py-4 rounded-2xl text-sm outline-none text-slate-800 placeholder-slate-400 bg-white/95 focus:bg-white transition-colors shadow-lg"
          />
          {showSugg && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 text-left">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => handlePick(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="text-slate-300 text-xs">🔍</span> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors cursor-pointer shadow-lg flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
}
