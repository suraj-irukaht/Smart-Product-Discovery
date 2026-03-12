// src/pages/EditProductPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import useCategories from "@/features/categories/hooks/useCategory";
import { useUpdateProduct, ProductForm } from "@features/seller";
import { useProductById } from "@features/products";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading: productLoading } = useProductById(id);
  const { data: catData } = useCategories();

  const product = productData?.product ?? null;
  const categories = catData?.categories ?? [];

  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = (formData) => {
    updateProduct(
      { id, data: formData },
      {
        onSuccess: () => navigate("/seller/products"),
      },
    );
  };

  if (productLoading) {
    return (
      <div className="flex justify-center py-20">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
        >
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
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", to: "/seller" },
          { label: "Products", to: "/seller/products" },
          { label: "Edit Product" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update your product details
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={product}
        onSubmit={handleSubmit}
        loading={isPending}
      />
    </div>
  );
}
