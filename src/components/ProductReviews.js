// components/ProductReview.js
import React from 'react';

const ReviewItem = ({ review }) => (
  <div className="review-item" style={{ borderBottom: '1px solid #eee', padding: '1rem 0', marginBottom: '1rem' }}>
    <p><strong>{review.authorName || 'Valued Customer'}</strong> - {review.rating} Stars</p>
    <p style={{ fontStyle: 'italic' }}>"{review.text}"</p>
    {review.imageUrl && (
      <img
        src={review.imageUrl}
        alt="Customer review"
        style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px', borderRadius: '4px' }}
      />
    )}
  </div>
);

const ProductReviews = ({ reviews }) => {
  return (
    <div className="reviews-list">
      <h3>Customer Reviews</h3>
      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => <ReviewItem key={index} review={review} />)
      ) : (
        <p>This product has no reviews yet. Be the first to leave one!</p>
      )}
    </div>
  );
};

export default ProductReviews;
