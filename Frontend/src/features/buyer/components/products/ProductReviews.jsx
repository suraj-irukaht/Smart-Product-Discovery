/**
 * ProductReviews.jsx
 *
 * Review list + AddReviewForm.
 * Shows average rating, review count, each review with stars + comment.
 *
 * Props:
 * - productId : string
 */
import { useGetReviews, useAddReview } from "@features/buyer/hooks/useReviews";
import AddReviewForm from "./AddReviewForm";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`text-sm ${s <= rating ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { data, isLoading } = useGetReviews(productId);
  const { mutateAsync: submit, isPending } = useAddReview(productId);

  const reviews = data?.reviews ?? [];
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reviews</h2>
          {avg && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-500">{avg}</span>
              <StarRating rating={Math.round(avg)} />
              <span className="text-xs text-slate-400">({reviews.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Add review form */}
      <AddReviewForm onSubmit={submit} submitting={isPending} />

      {/* List */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-3/4 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm font-semibold text-slate-600">No reviews yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Be the first to review this product
          </p>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl border border-slate-100 p-4"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                  {r.user_id?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">
                      {r.user_id?.name ?? "User"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <StarRating rating={r.rating} />
                  {r.comment && (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
