import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Review } from "@/types/product";

const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const allReviews: Review[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(allReviews);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (review: Review) => {
    await updateDoc(doc(db, "reviews", review.id), { approved: true });
  };

  const handleDelete = async (review: Review) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteDoc(doc(db, "reviews", review.id));
    }
  };

  const handleReply = async (review: Review) => {
    if (!reply.trim()) return;
    await updateDoc(doc(db, "reviews", review.id), { reply });
    setReplyingTo(null);
    setReply("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">Product ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Comment</th>
              <th className="p-2 border">Approved</th>
              <th className="p-2 border">Reply</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b">
                <td className="p-2 border">{review.productId}</td>
                <td className="p-2 border">{review.userName}</td>
                <td className="p-2 border">{review.rating}</td>
                <td className="p-2 border">{review.comment}</td>
                <td className="p-2 border">{(review as any).approved ? "Yes" : "No"}</td>
                <td className="p-2 border">{(review as any).reply || ""}</td>
                <td className="p-2 border">
                  {!(review as any).approved && (
                    <button
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() => handleApprove(review)}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(review)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow w-full max-w-lg"
            onSubmit={e => {
              e.preventDefault();
              const review = reviews.find(r => r.id === replyingTo);
              if (review) handleReply(review);
            }}
          >
            <h2 className="text-xl font-bold mb-4">Reply to Review</h2>
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply..."
            />
            <div className="flex gap-2 mt-4">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Send Reply</button>
              <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setReplyingTo(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;
