// components/ReviewForm.js
import React, { useState } from 'react';

const IMGBB_API_KEY = 'AIzaSyDVF-0nIEzFF78zCRVEjk0TEUxImxzEVnc';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProductImage(event.target.files[0]);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (productImage) {
        imageUrl = await uploadImageToImgBB(productImage);
      }

      const review = {
        productId,
        rating,
        text: reviewText,
        imageUrl,
        authorName: 'Anonymous',
        date: new Date().toISOString(),
      };

      // Save to localStorage for demo
      const existing = JSON.parse(localStorage.getItem(`reviews-${productId}`) || '[]');
      existing.push(review);
      localStorage.setItem(`reviews-${productId}`, JSON.stringify(existing));

      alert('Thank you for your review!');
      setReviewText('');
      setProductImage(null);
      setRating(5);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form" style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h3>Write a Review</h3>
      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
      </select>
      <br /><br />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience with the product..."
        required
        style={{ width: '100%', minHeight: '80px' }}
      />
      <br /><br />
      <label>Upload a photo of your product:</label>
      <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
      <br /><br />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
