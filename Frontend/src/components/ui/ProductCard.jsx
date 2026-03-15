import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Check, X, Loader2, Heart, Package } from "lucide-react";

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

  // ── Button state ─────────────────────────────────────────
  const btn = (() => {
    if (product.stock === 0)
      return {
        icon: <X className="w-4 h-4" />,
        className: "bg-muted text-muted-foreground cursor-not-allowed",
        disabled: true,
      };
    if (loading)
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        className: "bg-foreground/60 text-background cursor-wait",
        disabled: true,
      };
    if (isInCart)
      return {
        icon: <Check className="w-4 h-4" />,
        className: "bg-emerald-500 text-white cursor-default",
        disabled: true,
        tooltip: "Already in cart",
      };
    return {
      icon: <ShoppingBag className="w-4 h-4" />,
      className:
        "bg-foreground text-background hover:bg-foreground/80 hover:scale-110 active:scale-95",
      disabled: false,
    };
  })();

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* ── Image ───────────────────────────────────── */}
      <Link
        to={`/products/${product._id}`}
        className="block relative bg-muted overflow-hidden"
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
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Category pill */}
        {product.category?.name && (
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-3 py-1 rounded-full bg-card border border-border text-foreground shadow-sm capitalize">
            {product.category.name}
          </span>
        )}

        {/* Favorite button */}
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
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:scale-110 transition cursor-pointer"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              fill={isFavorited ? "#ef4444" : "none"}
              stroke={isFavorited ? "#ef4444" : "currentColor"}
              strokeWidth={1.8}
            />
          </button>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-foreground bg-card border border-border px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Info ────────────────────────────────────── */}
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <p className="text-sm font-semibold text-foreground truncate hover:text-muted-foreground transition-colors">
            {product.name}
          </p>
        </Link>

        {product.brand && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {product.brand}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            {/* Price */}
            {product.discountPrice ? (
              <div className="flex items-baseline gap-1.5">
                <p className="text-lg font-bold text-foreground">
                  ${Number(product.discountPrice).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground line-through">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-bold text-foreground">
                ${Number(product.price).toFixed(2)}
              </p>
            )}

            {/* Stock / cart badge */}
            {product.stock > 0 && product.stock <= 5 && !isInCart && (
              <span className="text-[11px] text-amber-600 font-medium bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                Only {product.stock} left
              </span>
            )}
            {isInCart && (
              <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                In cart
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAdd}
            disabled={btn.disabled}
            title={
              btn.tooltip ?? (isInCart ? "Already in cart" : "Add to cart")
            }
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm cursor-pointer ${btn.className}`}
          >
            {btn.icon}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
