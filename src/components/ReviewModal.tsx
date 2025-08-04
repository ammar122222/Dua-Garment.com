// ReviewModal.tsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '@/firebase'; // Added auth import
import { doc, getDoc, arrayUnion, updateDoc, Timestamp } from 'firebase/firestore'; // Added Timestamp import
import { Star, X, Send, AlertCircle, CheckCircle } from 'lucide-react'; // Added CheckCircle for success message
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth'; // Added for user authentication

// Define the OrderItem interface for better type safety
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
  hasBeenReviewed?: boolean;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  orderId?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, productId, productName, productImage, orderId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Listen for authentication state changes to get the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Check if the user is authenticated
    if (!currentUser) {
      setError('You must be logged in to submit a review.');
      return;
    }

    // Validate if a rating has been provided
    if (rating === 0) {
      setError('Please provide a rating before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get user information for the review data
      const userId = currentUser.uid;
      const userName = currentUser.displayName || 'Anonymous User';

      // Construct the review data object with user information and a Firestore Timestamp
      const reviewData = {
        rating,
        comment,
        createdAt: Timestamp.now(), // Use Firestore Timestamp for consistency
        userId,
        userName,
      };

      // Reference to the product document
      const productRef = doc(db, 'products', productId);

      // Atomically add the new review to the product's reviews array
      await updateDoc(productRef, {
        reviews: arrayUnion(reviewData),
      });

      // Update the order item to mark it as reviewed only if an orderId is provided
      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          const updatedItems = (orderData.items as OrderItem[]).map((item) =>
            item.productId === productId ? { ...item, hasBeenReviewed: true } : item
          );
          await updateDoc(orderRef, { items: updatedItems });
        }
      }
      
      // Set success state and close the modal after a brief delay
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000); // Wait 2 seconds before closing
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Product</h2>
        <p className="text-gray-600 mb-6">Share your experience with <span className="font-semibold text-blue-600">{productName}</span>.</p>

        <div className="flex items-center mb-6 space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            {productImage ? (
              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{productName}</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg flex items-center gap-2 mb-4">
            <CheckCircle size={20} />
            Review submitted successfully!
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              Submit Review
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
