"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

export default function ReviewSection({ productId, reviews = [] }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please write a comment before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment, name })
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to submit review.");
        return;
      }

      setSuccess(true);
      setComment("");
      setName("");
      setRating(5);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
        <h2 className="section-title !text-xl mb-6">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-white/50 text-sm">
            No reviews yet. Be the first to share your experience with this product!
          </p>
        ) : (
          <div className="space-y-6 max-h-[520px] overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-white/[0.06] pb-5 last:border-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-glow/30 to-emerald-glow/20 flex items-center justify-center text-xs font-bold text-white">
                      {review.name?.[0]?.toUpperCase() || "Z"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      {review.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-soft">✓ Verified Purchase</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-white/30">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="mt-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-semibold text-white mb-4">Write a Review</h3>

        {success && (
          <div className="mb-4 text-xs text-emerald-soft bg-emerald-glow/10 border border-emerald-glow/30 rounded-lg p-3">
            Thank you! Your review has been posted.
          </div>
        )}
        {error && (
          <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-white/50 mb-2">Your Rating</p>
            <StarRating rating={rating} interactive size="lg" onChange={setRating} />
          </div>

          <input
            type="text"
            placeholder="Your name (optional if logged in)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />

          <textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field resize-none"
          />

          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
