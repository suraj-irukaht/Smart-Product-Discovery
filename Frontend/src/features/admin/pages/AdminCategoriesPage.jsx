import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@features/admin";
import useCategories from "@/features/categories/hooks/useCategory";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import { PAGINATION } from "@/config/config.pagination";

const EMPTY_FORM = { name: "", description: "" };

export default function AdminCategoriesPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;

  const { data, isLoading } = useCategories(page);
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId) {
      updateCategory(
        { id: editingId, data: form },
        {
          onSuccess: () => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(false);
          },
        },
      );
    } else {
      createCategory(form, {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteCategory(confirmDeleteId, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-foreground)" }}
            >
              Manage Categories
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {data?.total ?? 0} total categories
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              + New Category
            </button>
          )}
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div
            className="rounded-xl border p-5 mb-6"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
            }}
          >
            <h2
              className="font-semibold mb-4"
              style={{ color: "var(--color-foreground)" }}
            >
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Electronics"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Optional description..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border text-sm hover:opacity-80"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={creating || updating}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 hover:opacity-90"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {creating || updating
                    ? "Saving..."
                    : editingId
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Empty */}
        {!isLoading && categories.length === 0 && (
          <div
            className="text-center py-20 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-4xl mb-3">🏷️</p>
            <p
              className="font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              No categories yet
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && categories.length > 0 && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-muted)",
                  }}
                >
                  {["Name", "Description", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr
                    key={cat._id}
                    style={{
                      borderBottom:
                        i < categories.length - 1
                          ? "1px solid var(--color-border)"
                          : "none",
                    }}
                  >
                    <td
                      className="px-4 py-3 font-medium capitalize"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {cat.name}
                    </td>

                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {cat.description || "—"}
                    </td>

                    <td
                      className="px-4 py-3 text-xs"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="rounded-md px-3 py-1 text-xs font-medium border hover:opacity-80"
                          style={{
                            borderColor: "var(--color-primary)",
                            color: "var(--color-primary)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(cat._id)}
                          disabled={deleting}
                          className="rounded-md px-3 py-1 text-xs font-medium border hover:opacity-80 disabled:opacity-40"
                          style={{ borderColor: "#ef4444", color: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm mx-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--color-foreground)" }}
            >
              Delete Category
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              This will not delete associated products but they will lose their
              category. Are you sure?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: "#ef4444" }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
