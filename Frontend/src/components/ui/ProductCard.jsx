import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";

function ProductCard({
  product,
  onAddToCart,
  isFavorited = false,
  onToggleFav,
  isInCart = false,
}) {
  const [loading, setLoading] = useState(false);

  const image =
    product.mainImage || product.main_image || product.image_url?.[0];

  const handleAdd = useCallback(async () => {
    if (loading || isInCart || product.stock === 0) return;
    setLoading(true);
    try {
      await onAddToCart();
    } finally {
      setLoading(false);
    }
  }, [loading, isInCart, product.stock, onAddToCart]);

  // ── Button state ─────────────────────────
  const btnConfig = (() => {
    if (product.stock === 0)
      return {
        label: null,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        className: "bg-slate-100 text-slate-300 cursor-not-allowed",
        disabled: true,
      };
    if (loading)
      return {
        icon: (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ),
        className: "bg-indigo-400 text-white cursor-wait",
        disabled: true,
      };
    if (isInCart)
      return {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        ),
        className: "bg-emerald-500 text-white cursor-not-allowed",
        disabled: true,
        tooltip: "Already in cart",
      };
    return {
      icon: <span className="text-xl leading-none">+</span>,
      className:
        "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 active:scale-95",
      disabled: false,
    };
  })();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* IMAGE */}
      <Link
        to={`/products/${product._id}`}
        className="block relative bg-slate-100 overflow-hidden"
        style={{ aspectRatio: "1" }}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">
            📦
          </div>
        )}

        {product.category?.name && (
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm capitalize">
            {product.category.name}
          </span>
        )}

        {onToggleFav && (
          <button
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFav();
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:scale-110 transition cursor-pointer"
          >
            {isFavorited ? (
              <svg viewBox="0 0 24 24" fill="#ef4444" className="w-4 h-4">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg
                fill="none"
                strokeWidth={1.8}
                stroke="#94a3b8"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            )}
          </button>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* INFO */}
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <p className="text-sm font-semibold text-slate-800 truncate hover:text-indigo-600 transition">
            {product.name}
          </p>
        </Link>
        {product.brand && (
          <p className="text-xs text-slate-400 mt-1 truncate">
            {product.brand}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            <p className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                Only {product.stock} left
              </span>
            )}
            {isInCart && (
              <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                In cart
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={btnConfig.disabled}
            title={
              btnConfig.tooltip ??
              (isInCart ? "Already in cart" : "Add to cart")
            }
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm cursor-pointer ${btnConfig.className}`}
          >
            {btnConfig.icon}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
