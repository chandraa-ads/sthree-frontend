import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  reviewCount?: number;
}

export function RatingStars({
  rating,
  size = "sm",
  showCount = false,
  reviewCount,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const stars = [1, 2, 3, 4, 5].map((starNumber) => {
    const diff = rating - starNumber;
    if (diff >= 0) {
      // full star
      return (
        <Star
          key={starNumber}
          className={`${sizeClasses[size]} text-yellow-400 fill-current`}
        />
      );
    } else if (diff > -1 && diff < 0) {
      // half star
      return (
        <Star
          key={starNumber}
          className={`${sizeClasses[size]} text-yellow-400 fill-current`}
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    } else {
      // empty star
      return (
        <Star
          key={starNumber}
          className={`${sizeClasses[size]} text-gray-300`}
        />
      );
    }
  });

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">{stars}</div>
      <span
        className={`${textSizeClasses[size]} text-gray-600 font-medium`}
      >
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
