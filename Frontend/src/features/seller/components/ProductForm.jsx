// import { useState, useEffect, useRef } from "react";
// import ImageUploader from "../components/ImageUploader";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// export default function ProductForm({
//   categories = [],
//   initialData,
//   onSubmit,
//   loading,
// }) {
//   const EMPTY_FORM = {
//     name: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     stock: "",
//     category_id: "",
//   };
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [images, setImages] = useState([]);
//   const [errors, setErrors] = useState({});

//   // ← remove mainIndex state, no longer needed

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         name: initialData.name || "",
//         brand: initialData.brand || "",
//         description: initialData.description || "",
//         price: initialData.price || "",
//         discountPrice: initialData.discountPrice || "",
//         stock: initialData.stock || "",
//         category_id: initialData.category_id?._id || "",
//       });
//     } else {
//       resetForm();
//     }
//   }, [initialData]);

//   // ── Reset everything ──────────────────────────────────────
//   const resetForm = () => {
//     setForm(EMPTY_FORM);
//     setImages([]);
//     setErrors({});
//   };

//   // ── Reset after successful upload ─────────────────────────
//   const prevLoading = useRef(false);
//   useEffect(() => {
//     if (prevLoading.current === true && loading === false && !initialData) {
//       resetForm(); // loading just finished + it's create mode → reset
//     }
//     prevLoading.current = loading;
//   }, [loading]);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const validate = () => {
//     const newErrors = {};
//     if (!form.name.trim()) newErrors.name = "Product name is required";
//     if (!form.price || Number(form.price) <= 0)
//       newErrors.price = "Valid price required";
//     if (!form.stock || Number(form.stock) < 0)
//       newErrors.stock = "Stock required";
//     if (!form.category_id) newErrors.category_id = "Select category";
//     if (images.length === 0 && !initialData)
//       newErrors.images = "Upload at least one image";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("brand", form.brand);
//     formData.append("description", form.description);
//     formData.append("price", Number(form.price));
//     formData.append("discountPrice", Number(form.discountPrice) || 0);
//     formData.append("stock", Number(form.stock));
//     formData.append("category_id", form.category_id);
//     images.forEach((img) => formData.append("images", img.file));
//     formData.append("mainImage", 0); // first is always main

//     onSubmit(formData, resetForm);
//   };

//   const inputClass =
//     "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

//   return (
//     // ← relative so overlay can position against it
//     <div className="relative">
//       {/* Loading overlay — sits on top of entire form */}
//       {loading && <LoadingSpinner />}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* PRODUCT INFO */}
//         <section className="bg-white border rounded-xl p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Product Information</h2>
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Product Name *
//             </label>
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Wireless Headphones"
//               className={inputClass}
//             />
//             {errors.name && (
//               <p className="text-xs text-red-500 mt-1">{errors.name}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Brand</label>
//             <input
//               name="brand"
//               value={form.brand || ""}
//               onChange={handleChange}
//               placeholder="e.g. Nike"
//               className={inputClass}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               rows={4}
//               value={form.description}
//               onChange={handleChange}
//               className={inputClass}
//             />
//           </div>
//         </section>

//         {/* PRODUCT IMAGES */}
//         <section className="bg-white border rounded-xl p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Product Images</h2>
//           <ImageUploader images={images} setImages={setImages} />
//           {errors.images && (
//             <p className="text-xs text-red-500">{errors.images}</p>
//           )}
//         </section>

//         {/* PRICING */}
//         <section className="bg-white border rounded-xl p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Pricing</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Price *</label>
//               <input
//                 name="price"
//                 type="number"
//                 value={form.price}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//               {errors.price && (
//                 <p className="text-xs text-red-500 mt-1">{errors.price}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Discount Price
//               </label>
//               <input
//                 name="discountPrice"
//                 type="number"
//                 value={form.discountPrice}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>
//         </section>

//         {/* INVENTORY */}
//         <section className="bg-white border rounded-xl p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Inventory</h2>
//           <div>
//             <label className="block text-sm font-medium mb-1">Stock *</label>
//             <input
//               name="stock"
//               type="number"
//               value={form.stock}
//               onChange={handleChange}
//               className={inputClass}
//             />
//             {errors.stock && (
//               <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
//             )}
//           </div>
//         </section>

//         {/* CATEGORY */}
//         <section className="bg-white border rounded-xl p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Category</h2>
//           <div>
//             <select
//               name="category_id"
//               value={form.category_id}
//               onChange={handleChange}
//               className={inputClass}
//             >
//               <option value="">Select category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category_id && (
//               <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>
//             )}
//           </div>
//         </section>

//         {/* ACTION BAR */}
//         <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className="px-4 py-2 border rounded-lg"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
//           >
//             {loading
//               ? "Saving..."
//               : initialData
//                 ? "Update Product"
//                 : "Create Product"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EMPTY_FORM = {
  name: "",
  brand: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  category_id: "",
};

export default function ProductForm({
  categories = [],
  initialData,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // new File uploads
  const [existingImages, setExistingImages] = useState([]); // URLs from DB
  const [errors, setErrors] = useState({});

  /* ── Populate form on edit ─────────────────────────────── */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        price: initialData.price || "",
        discountPrice: initialData.discountPrice || "",
        stock: initialData.stock || "",
        category_id:
          initialData.category_id?._id || initialData.category_id || "",
      });
      setExistingImages(initialData.image_url ?? []);
      setImages([]);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImages([]);
    setExistingImages([]);
    setErrors({});
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Validation ────────────────────────────────────────── */
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Valid price required";
    if (form.stock === "" || Number(form.stock) < 0)
      newErrors.stock = "Stock required";
    if (!form.category_id) newErrors.category_id = "Select category";
    if (images.length === 0 && existingImages.length === 0 && !initialData)
      newErrors.images = "Upload at least one image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand || "");
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("discountPrice", Number(form.discountPrice) || 0);
    formData.append("stock", Number(form.stock));
    formData.append("category_id", form.category_id);
    formData.append("mainImage", 0);

    // Existing image URLs (kept by user)
    existingImages.forEach((url) => formData.append("existingImages", url));

    // New file uploads
    images.forEach((img) => formData.append("images", img.file));

    onSubmit(formData, resetForm);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="relative">
      {/* Loading overlay */}
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PRODUCT INFO */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Wireless Headphones"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Nike"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </section>

        {/* PRODUCT IMAGES */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Images</h2>
          <ImageUploader
            images={images}
            setImages={setImages}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
          />
          {errors.images && (
            <p className="text-xs text-red-500">{errors.images}</p>
          )}
        </section>

        {/* PRICING */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Price
              </label>
              <input
                name="discountPrice"
                type="number"
                value={form.discountPrice}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* INVENTORY */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Inventory</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.stock && (
              <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
            )}
          </div>
        </section>

        {/* CATEGORY */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Category</h2>
          <div>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>
            )}
          </div>
        </section>

        {/* ACTION BAR */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 text-sm"
          >
            {loading
              ? "Saving..."
              : initialData
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
