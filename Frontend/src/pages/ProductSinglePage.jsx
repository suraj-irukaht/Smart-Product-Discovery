/**
 * ProductSinglePage.jsx
 *
 * Product detail page — orchestration only.
 * Tracks recently viewed on mount.
 * Wires cart, favorites, reviews, related products.
 *
 * Route: /products/:id
 * Layout: BuyerLayout
 */
import api from "@/services/api";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/request";
import { useGetCart, useAddToCart } from "@features/buyer/hooks/useCart";
import {
  useGetFavorites,
  useToggleFavorite,
} from "@features/buyer/hooks/useFavorites";

import ProductImages from "../features/buyer/components/products/ProductImages";
import ProductInfo from "../features/buyer/components/products/ProductInfo";
import ProductReviews from "../features/buyer/components/products/ProductReviews";
import RelatedProducts from "../features/buyer/components/products/RelatedProducts";

const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export default function ProductSinglePage() {
  const { id } = useParams();

  const { data: productData, isLoading } = useProduct(id);
  const { data: cartData } = useGetCart();
  const { data: favData } = useGetFavorites({ limit: 100 });
  const { mutateAsync: addToCart } = useAddToCart();
  const { add: addFav, remove: removeFav } = useToggleFavorite();

  const product = productData?.product ?? productData;

  console.log(product);

  const cartItemIds = new Set(
    cartData?.cart?.map((c) => String(c.product_id?._id || c.product_id)) ?? [],
  );
  const favoritedIds = new Set(
    favData?.favorites?.map((f) => String(f.product_id?._id || f.product_id)) ??
      [],
  );

  const isInCart = cartItemIds.has(String(id));
  const isFavorited = favoritedIds.has(String(id));

  const handleToggleFav = () => {
    if (isFavorited) {
      removeFav(id);
    } else {
      addFav(id);
    }
  };

  const handleAddToCart = () => addToCart({ product_id: id, quantity: 1 });

  const handleToggleRelatedFav = (productId) => {
    if (favoritedIds.has(String(productId))) {
      removeFav(productId);
    } else {
      addFav(productId);
    }
  };

  /* ── Loading ──────────────────────────────────────── */
  if (isLoading) return <ProductSkeleton />;

  /* ── Not found ────────────────────────────────────── */
  if (!product)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-bold text-slate-700 text-lg mb-2">
            Product not found
          </p>
          <Link
            to="/products"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );

  const images = [product.mainImage, ...(product.image_url ?? [])].filter(
    Boolean,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link
            to="/products"
            className="hover:text-indigo-600 transition-colors"
          >
            Products
          </Link>
          {product.category?.name && (
            <>
              <span>›</span>
              <Link
                to={`/products?category=${product.category._id}`}
                className="hover:text-indigo-600 transition-colors capitalize"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>›</span>
          <span className="text-slate-600 font-medium truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>

        {/* Main: images + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImages images={images} name={product.name} />
          <ProductInfo
            product={product}
            isInCart={isInCart}
            isFavorited={isFavorited}
            onAddToCart={handleAddToCart}
            onToggleFav={handleToggleFav}
          />
        </div>

        <div className="h-px bg-slate-200" />

        {/* Reviews */}
        <ProductReviews productId={id} />

        <div className="h-px bg-slate-200" />
        <h1>Related</h1>
        {/* Related products */}
        {product.category_id._id && (
          <RelatedProducts
            categoryId={product.category_id._id}
            excludeId={id}
            cartItemIds={cartItemIds}
            favoritedIds={favoritedIds}
            onAddToCart={(pid) => addToCart({ product_id: pid, quantity: 1 })}
            onToggleFav={handleToggleRelatedFav}
          />
        )}
      </div>
    </div>
  );
}

/* ── Page Skeleton ─────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-4 w-64 bg-slate-200 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="space-y-4 py-2">
            <div className="h-4 w-24 bg-slate-200 rounded-full" />
            <div className="h-7 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-9 w-1/3 bg-slate-200 rounded" />
            <div className="h-4 w-1/4 bg-slate-200 rounded-full mt-4" />
            <div className="space-y-2 mt-2">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
              <div className="h-3 bg-slate-100 rounded w-4/6" />
            </div>
            <div className="h-14 bg-slate-200 rounded-2xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
