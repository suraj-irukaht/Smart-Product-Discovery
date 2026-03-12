import { Link } from "react-router-dom";
export default function EmptyProducts({ onAdd }) {
  return (
    <div
      className="text-center py-20 rounded-xl border-2 border-dashed"
      style={{ borderColor: "var(--color-border)" }}
    >
      <p className="text-4xl mb-3">📦</p>
      <p className="font-medium" style={{ color: "var(--color-foreground)" }}>
        No products yet
      </p>
      <p
        className="text-sm mt-1 mb-4"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        Start by adding your first product
      </p>
      <Link
        to="/products/seller/create"
        className="rounded-lg px-4 py-2 text-sm font-semibold"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        + Add Product
      </Link>
    </div>
  );
}
