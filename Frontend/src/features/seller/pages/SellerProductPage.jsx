import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import {
  ProductTable,
  EmptyProducts,
  DeleteConfirmModal,
  useGetMyProducts,
  useDeleteProduct,
} from "@features/seller";

import Pagination from "@/components/ui/Pagination";
import useCategories from "@/features/categories/hooks/useCategory";
import { PAGINATION } from "@/config/config.pagination";

export default function SellerProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /* ───────────── DATA ───────────── */

  const { data: catData } = useCategories();
  const { data, isLoading } = useGetMyProducts(page, limit);

  const categories = catData?.categories ?? [];
  const products = data?.products ?? [];

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  console.log(total);

  /* ───────────── CATEGORY MAP ───────────── */

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map((c) => [c._id, c.name]));
  }, [categories]);

  /* ───────────── DELETE PRODUCT ───────────── */

  const { mutate: remove, isPending: deleting } = useDeleteProduct(() =>
    setDeleteConfirm(null),
  );

  /* ───────────── NAVIGATION ───────────── */

  const handleEdit = (product) => {
    navigate(`/products/seller/edit/${product._id}`);
  };

  /* ───────────── RENDER ───────────── */

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-[900px] mx-auto pb-14">
        {/* HEADER */}
        <Header total={total} />

        {/* CONTENT */}
        {isLoading && <LoadingSpinner />}

        {!isLoading && products.length === 0 && <EmptyProducts />}

        {!isLoading && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              categoryMap={categoryMap}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
            />

            <Pagination totalPages={totalPages} total={total} />
          </>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <DeleteConfirmModal
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => remove(deleteConfirm)}
          loading={deleting}
        />
      )}
    </div>
  );
}

/* ───────────── HEADER ───────────── */

function Header({ total }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>

        <p className="text-sm text-gray-500 mt-0.5">{total} total products</p>
      </div>

      <Link
        to="/products/seller/create"
        className="rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:opacity-90"
      >
        + Add Product
      </Link>
    </div>
  );
}
