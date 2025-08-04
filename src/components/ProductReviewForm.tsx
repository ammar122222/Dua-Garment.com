import { useState } from 'react';
import { db, auth } from '@/firebase';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

interface ProductReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // Callback to close the form/modal or update UI
}

export const ProductReviewForm = ({ productId, onReviewSubmitted }: ProductReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID is missing. Cannot submit review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({ title: "Validation Error", description: "Please select a star rating.", variant: "destructive" });
      return;
    }

    if (!comment.trim()) {
      toast({ title: "Validation Error", description: "Please enter a comment.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const productRef = doc(db, 'products', productId);
      const newReview = {
        id: crypto.randomUUID(), // Add a unique ID for each review for future editing/deleting
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous User',
        rating,
        comment: comment.trim(),
        createdAt: Timestamp.now(),
      };

      // Atomically add the new review to the 'reviews' array of the product
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview)
      });

      toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
      onReviewSubmitted(); // Notify parent component
    } catch (error: any) {
      console.error("Error submitting review:", error);
      let description = "There was an error submitting your review.";
      // Provide more specific feedback for common Firestore errors
      if (error.code === 'permission-denied') {
        description = "You do not have permission to add a review to this product.";
      }
      toast({ title: "Submission Failed", description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="font-semibold">Your Rating</Label>
        <div className="flex items-center space-x-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              role="button"
              tabIndex={0}
              aria-label={`Rate ${star} out of 5 stars`}
              className={`h-7 w-7 cursor-pointer transition-all duration-150 ${
                (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setRating(star);
                }
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment" className="font-semibold">Your Review</Label>
        <Textarea
          id="comment"
          placeholder="Tell us what you think about the product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={isLoading}
          className="mt-2"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};