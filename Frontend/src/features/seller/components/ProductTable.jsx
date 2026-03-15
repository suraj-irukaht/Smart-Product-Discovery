import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Pencil, Trash2, Tag, AlertTriangle } from "lucide-react";

export default function ProductTable({ products, onDelete, categoryMap = {} }) {
  if (!products.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {products.map((p) => (
        <Card
          key={p._id}
          className=" hover:shadow-md transition-all duration-200 group"
        >
          <CardContent className="">
            <div className="grid gap-4">
              {/* ── Thumbnail ─────────────────────────── */}
              <div className="">
                {p.mainImage ? (
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
                    <Package className="w-6 h-6 text-violet-400" />
                  </div>
                )}
              </div>

              {/* ── Name + description ────────────────── */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {p.description}
                  </p>
                )}

                {/* Mobile: meta row */}
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:hidden">
                  <CategoryBadge label={categoryMap[p.category_id]} />
                  <PriceBadge price={p.price} discountPrice={p.discountPrice} />
                  <StockBadge stock={p.stock} />
                </div>
              </div>

              {/* ── Desktop meta ──────────────────────── */}
              <div className="flex items-center gap-3 shrink-0">
                <CategoryBadge label={categoryMap[p.category_id]} />
                <PriceBadge price={p.price} discountPrice={p.discountPrice} />
                <StockBadge stock={p.stock} />
              </div>

              {/* ── Actions ───────────────────────────── */}
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-800 dark:hover:bg-violet-950"
                >
                  <Link to={`/products/seller/edit/${p._id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(p._id)}
                  className="h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function CategoryBadge({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <Tag className="w-3 h-3 text-muted-foreground" />
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400 capitalize">
        {label || "—"}
      </span>
    </div>
  );
}

function PriceBadge({ price, discountPrice }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
      {discountPrice ? (
        <>
          <span className="line-through text-xs text-muted-foreground font-normal">
            ${Number(price).toFixed(2)}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">
            ${Number(discountPrice).toFixed(2)}
          </span>
        </>
      ) : (
        <span>${Number(price).toFixed(2)}</span>
      )}
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-1 text-xs font-semibold text-rose-500">
        <AlertTriangle className="w-3 h-3" />
        Out of stock
      </div>
    );
  }
  if (stock < 5) {
    return (
      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
        <AlertTriangle className="w-3 h-3" />
        Low: {stock}
      </div>
    );
  }
  return (
    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      Stock: {stock}
    </span>
  );
}
