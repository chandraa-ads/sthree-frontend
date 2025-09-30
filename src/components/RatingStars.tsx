import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  reviewCount?: number;
}

export function RatingStars({ rating, size = 'sm', showCount = false, reviewCount }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
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