/**
 * AddReviewForm.jsx
 *
 * Star rating selector + comment textarea.
 * Submits POST /products/:id/review
 * Hidden if user already reviewed (backend returns 400 with duplicate key).
 *
 * Props:
 * - onSubmit   : ({ rating, comment }) => Promise
 * - submitting : boolean
 */
import { useState } from "react";

export default function AddReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    await onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setComment("");
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
      <p className="text-sm font-bold text-slate-800 mb-4">Write a Review</p>

      {/* Star selector */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl transition-transform hover:scale-110 cursor-pointer leading-none"
            >
              {star <= (hovered || rating) ? "★" : "☆"}
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs text-slate-400 ml-2 self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 placeholder-slate-400 resize-none bg-white"
      />

      <button
        onClick={handleSubmit}
        disabled={!rating || !comment.trim() || submitting}
        className="mt-3 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
