import { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Image,
  DollarSign,
  Warehouse,
  Tags,
  Loader2,
} from "lucide-react";

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
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  /* ── Populate on edit ───────────────────────────────────── */
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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Validation ─────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Valid price required";
    if (form.stock === "" || Number(form.stock) < 0)
      e.stock = "Stock is required";
    if (!form.category_id) e.category_id = "Select a category";
    if (!initialData && images.length === 0 && existingImages.length === 0)
      e.images = "Upload at least one image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ─────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("brand", form.brand || "");
    fd.append("description", form.description);
    fd.append("price", Number(form.price));
    fd.append("discountPrice", Number(form.discountPrice) || 0);
    fd.append("stock", Number(form.stock));
    fd.append("category_id", form.category_id);
    fd.append("mainImage", 0);
    existingImages.forEach((url) => fd.append("existingImages", url));
    images.forEach((img) => fd.append("images", img.file));
    onSubmit(fd, resetForm);
  };

  const isEdit = !!initialData;

  return (
    <div className="max-w-2xl mx-auto pb-28">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── Product Info ─────────────────────────────── */}
        <SectionCard icon={Package} title="Product Information">
          <Field label="Product Name" required error={errors.name}>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              className={errors.name ? "border-destructive" : ""}
            />
          </Field>
          <Field label="Brand">
            <Input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Sony"
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your product…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground text-foreground"
            />
          </Field>
        </SectionCard>

        {/* ── Images ──────────────────────────────────── */}
        <SectionCard icon={Image} title="Product Images">
          <ImageUploader
            images={images}
            setImages={setImages}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
          />
          {errors.images && (
            <p className="text-xs text-destructive mt-1">{errors.images}</p>
          )}
        </SectionCard>

        {/* ── Pricing ─────────────────────────────────── */}
        <SectionCard icon={DollarSign} title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" required error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
                />
              </div>
            </Field>
            <Field label="Discount Price">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  name="discountPrice"
                  type="number"
                  value={form.discountPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </Field>
          </div>
          {form.discountPrice && Number(form.discountPrice) > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              Saving $
              {(Number(form.price) - Number(form.discountPrice)).toFixed(2)} off
              original price
            </p>
          )}
        </SectionCard>

        {/* ── Inventory ───────────────────────────────── */}
        <SectionCard icon={Warehouse} title="Inventory">
          <Field label="Stock Quantity" required error={errors.stock}>
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className={`max-w-[160px] ${errors.stock ? "border-destructive" : ""}`}
            />
          </Field>
          {form.stock !== "" && (
            <p
              className={`text-xs mt-1 ${
                Number(form.stock) === 0
                  ? "text-destructive"
                  : Number(form.stock) < 5
                    ? "text-amber-500"
                    : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {Number(form.stock) === 0
                ? "⚠ Out of stock"
                : Number(form.stock) < 5
                  ? `⚠ Low stock — only ${form.stock} left`
                  : `✓ ${form.stock} units in stock`}
            </p>
          )}
        </SectionCard>

        {/* ── Category ────────────────────────────────── */}
        <SectionCard icon={Tags} title="Category">
          <Field label="Category" required error={errors.category_id}>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={`w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground ${
                errors.category_id ? "border-destructive" : "border-input"
              }`}
            >
              <option value="">Select a category…</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>
        </SectionCard>

        {/* ── Sticky action bar ───────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border px-4 py-3 flex items-center justify-end gap-3 md:sticky md:bottom-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving…
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ── Section card wrapper ───────────────────────────────────── */
function SectionCard({ icon: Icon, title, children }) {
  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/* ── Field wrapper ──────────────────────────────────────────── */
function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
