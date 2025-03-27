import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
  const emptyStars = 5 - Math.ceil(rating); // Number of empty stars

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
      ))}
      {/* Half Star */}
      {hasHalfStar && (
        <StarHalf size={16} className="text-yellow-500 fill-yellow-500" />
      )}
      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i + fullStars} size={16} className="text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;