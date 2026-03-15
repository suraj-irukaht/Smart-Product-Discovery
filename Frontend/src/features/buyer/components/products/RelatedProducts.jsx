/**
 * RelatedProducts.jsx
 *
 * Smart discovery sections shown on the product detail page.
 * Replaces the old flat "same category" query with 3 behavioral signals:
 *
 *  1. "Similar to This"         → useBecauseYouViewed  (same category + price range)
 *  2. "Others Also Viewed"      → useUsersAlsoViewed   (collaborative filtering)
 *  3. "Complete the Set"        → useFrequentlyBoughtTogether (co-purchase patterns)
 *
 * Props:
 *  - productId   : string   current product _id
 *  - cartItemIds : Set<string>
 *  - favoritedIds: Set<string>
 *  - onAddToCart : (productId) => void
 *  - onToggleFav : (productId) => void
 */
import ProductCard from "@/components/ui/ProductCard";
import {
  useBecauseYouViewed,
  useUsersAlsoViewed,
  useFrequentlyBoughtTogether,
} from "@features/buyer/hooks/useDiscovery";

/* ── Skeleton row ───────────────────────────────────────────── */
function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-slate-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Reusable section wrapper ───────────────────────────────── */
function DiscoverySection({
  title,
  subtitle,
  products,
  isLoading,
  cartItemIds,
  favoritedIds,
  onAddToCart,
  onToggleFav,
}) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {isLoading ? (
        <SectionSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={() => onAddToCart(p._id)}
              isFavorited={favoritedIds?.has(String(p._id))}
              onToggleFav={() => onToggleFav(p._id)}
              isInCart={cartItemIds?.has(String(p._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function RelatedProducts({
  productId,
  cartItemIds,
  favoritedIds,
  onAddToCart,
  onToggleFav,
}) {
  // ── Hook 1: Same category + similar price ────────────────
  const { data: becauseData, isLoading: becauseLoading } =
    useBecauseYouViewed(productId);

  // ── Hook 2: Collaborative filtering ──────────────────────
  const { data: alsoViewedData, isLoading: alsoViewedLoading } =
    useUsersAlsoViewed(productId);

  // ── Hook 3: Co-purchase patterns ─────────────────────────
  const { data: boughtData, isLoading: boughtLoading } =
    useFrequentlyBoughtTogether(productId);

  // Normalize — "also viewed" and "bought together" return { product: {...} }
  const normalize = (arr) =>
    (arr ?? []).filter((t) => t?.product?._id).map((t) => ({ ...t.product }));

  const similar = becauseData?.products ?? [];
  const alsoViewed = normalize(alsoViewedData?.products);
  const boughtTogether = normalize(boughtData?.products);

  const sharedProps = { cartItemIds, favoritedIds, onAddToCart, onToggleFav };

  return (
    <div className="space-y-12">
      {/* 1. Similar to This */}
      <DiscoverySection
        title="👀 Similar to This"
        subtitle={
          becauseData?.basedOn?.name
            ? `Because you're viewing ${becauseData.basedOn.name}`
            : "Products in the same category"
        }
        products={similar}
        isLoading={becauseLoading}
        {...sharedProps}
      />

      {/* 2. Others Also Viewed */}
      <DiscoverySection
        title="🔍 Others Also Viewed"
        subtitle="Shoppers who viewed this also checked these out"
        products={alsoViewed}
        isLoading={alsoViewedLoading}
        {...sharedProps}
      />

      {/* 3. Frequently Bought Together */}
      <DiscoverySection
        title="🛒 Complete the Set"
        subtitle="Frequently bought together with this product"
        products={boughtTogether}
        isLoading={boughtLoading}
        {...sharedProps}
      />
    </div>
  );
}
