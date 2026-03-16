import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@features/admin";
import useCategories from "@/features/categories/hooks/useCategory";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tags, Plus, Pencil, Trash2, Calendar, X } from "lucide-react";

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
  const [deleteId, setDeleteId] = useState(null);
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
    // scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto space-y-5">
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data?.total ?? 0} total categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
              <Tags className="w-5 h-5 text-purple-500" />
            </div>
            {!showForm && (
              <Button
                size="sm"
                onClick={() => setShowForm(true)}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            )}
          </div>
        </div>

        {/* ── Create / Edit Form ───────────────────────── */}
        {showForm && (
          <Card className="border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">
                  {editingId ? "Edit Category" : "New Category"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Electronics"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Optional description..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-1">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={creating || updating}
                  >
                    {creating || updating
                      ? "Saving..."
                      : editingId
                        ? "Update"
                        : "Create"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* ── Loading skeletons ────────────────────────── */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-2/3 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────── */}
        {!isLoading && categories.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
              <Tags className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No categories yet</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowForm(true)}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create first category
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Category Cards ───────────────────────────── */}
        {!isLoading && categories.length > 0 && (
          <div className=" md:grid md:grid-cols-2 gap-5">
            {categories.map((cat) => (
              <Card
                key={cat._id}
                className={`border hover:shadow-md transition-shadow duration-200 ${
                  editingId === cat._id ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  {/* Row 1: Name + actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center shrink-0">
                        <Tags className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cat)}
                        className="h-7 w-7 p-0 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(cat._id)}
                        disabled={deleting}
                        className="h-7 w-7 p-0 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: Joined date */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground">
                      Created{" "}
                      {new Date(cat.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </div>

      {/* ── Delete Confirm Dialog ────────────────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              This will not delete associated products but they will lose their
              category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteCategory(deleteId, { onSuccess: () => setDeleteId(null) })
              }
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
