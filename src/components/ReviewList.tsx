import React from 'react';

// Define the structure of a Review object to match what's in Firestore
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: { // This is how Firestore returns timestamps
    seconds: number;
    nanoseconds: number;
  };
  productId: string;
  userId: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600 mt-4">No reviews yet. Be the first to leave one!</p>;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">Customer Reviews</h3>
      <ul className="space-y-8">
        {reviews.map((review) => (
          <li key={review.id}>
            <div className="flex items-center mb-2">
              <p className="font-semibold mr-4">{review.userName}</p>
              <div className="flex items-center">
                {/* Simple star rating display */}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.175 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-2">
              Reviewed on {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;