"use client";

export default function StarRating({ rating = 0, count, size = "sm", interactive = false, onChange }) {
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
  const starClass = sizes[size] || sizes.sm;

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
              aria-label={`${star} star`}
            >
              <svg
                viewBox="0 0 20 20"
                className={`${starClass} ${
                  filled ? "fill-gold text-gold" : "fill-none text-white/20"
                } stroke-current`}
                strokeWidth="1"
              >
                <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.6 1-5.79-4.21-4.1 5.82-.85z" />
              </svg>
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-white/50">
          {rating?.toFixed?.(1) ?? "0.0"} ({count})
        </span>
      )}
    </div>
  );
}
