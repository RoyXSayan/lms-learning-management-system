// RatingReviewSection.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useSubmitReviewMutation } from "@/features/api/purchaseApi";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const RatingReviewSection = ({ rating = 0, reviews = [] }) => {
  const { courseId } = useParams();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitReview, { isLoading }] = useSubmitReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRating || !comment) return alert("Please fill out all fields");

    try {
      await submitReview({ courseId, rating: userRating, comment }).unwrap();
      setUserRating(0);
      setComment("");
      alert("Review submitted ✅");
      window.location.reload(); // Refresh to show updated reviews
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  
console.log("Review props:", reviews);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Rating & Reviews ({reviews.length})
      </h2>

      {/* Average Rating */}
      <div className="mb-4 flex items-center gap-2">
        <FaStar className="text-yellow-400" />
        <span className="text-lg font-medium">{rating.toFixed(1) || "N/A"}</span>
        <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
      </div>

      {/* Submit Review Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 rounded-md shadow">
        <h3 className="font-semibold">Submit your review</h3>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={20}
              className={`cursor-pointer ${i < (hoverRating || userRating) ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setUserRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{userRating}/5</span>
        </div>

        <Textarea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this course!</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className=" p-4 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.user?.name || "Anonymous"}</p>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm  mt-1">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingReviewSection;
