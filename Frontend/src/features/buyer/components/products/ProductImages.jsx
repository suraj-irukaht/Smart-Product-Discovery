/**
 * ProductImages.jsx
 *
 * Main image display with thumbnail strip below.
 * Clicking a thumbnail swaps the main image.
 *
 * Props:
 * - images   : string[]  all image URLs
 * - name     : string    product name (alt text)
 */
import { useState } from "react";

export default function ProductImages({ images = [], name = "" }) {
  const [selected, setSelected] = useState(0);
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-6xl">
        📦
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
        <img
          src={validImages[selected]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                i === selected
                  ? "border-indigo-500 shadow-sm shadow-indigo-100"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <img
                src={img}
                alt={`${name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
