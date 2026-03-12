import useCategories from "@/features/categories/hooks/useCategory";
import { useCreateProduct, ProductForm } from "@features/seller";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CreateProductPage() {
  const { data } = useCategories();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const categories = data?.categories || [];

  const handleSubmit = (formData, resetForm) => {
    createProduct(formData, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", to: "/seller" },
          { label: "Products", to: "/seller/products" },
          { label: "Create Product" },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>

        <p className="text-gray-500 text-sm mt-1">
          Add a new product to your store
        </p>
      </div>

      {/* Form */}
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        loading={isPending}
      />
    </div>
  );
}
