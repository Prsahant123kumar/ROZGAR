





import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

const AddReviewForm = ({ WorkersId, userId, fullname }) => {
  const API_END_POINT = "http://localhost:3000/api/v1/Workers";
  axios.defaults.withCredentials = true;

  const [input, setInput] = useState({
    rating: 0, // default 0 means none selected
    comment: "",
  });

  // Update comment text
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  // Function to handle star click
  const handleStarClick = (ratingValue) => {
    setInput({ ...input, rating: ratingValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_END_POINT}/reviews/${WorkersId}`,
        { userId, fullname, rating: input.rating, comment: input.comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Review submitted successfully!");
      setInput({ rating: 0, comment: "" });
    } catch (error) {
      alert("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          Leave a Review
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Your feedback helps us improve our services.
        </p>
      </div>
      <div className="space-y-4">
        {/* Clickable Star Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-gray-700 dark:text-gray-300">Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    input.rating >= star
                      ? "fill-yellow-500 stroke-yellow-500"
                      : "fill-transparent stroke-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Comment Textarea */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-gray-700 dark:text-gray-300">Your Review</Label>
          <Textarea
            name="comment"
            value={input.comment}
            onChange={changeEventHandler}
            placeholder="Share your experience..."
            className="min-h-[120px] text-gray-900 dark:text-white"
          />
        </div>
        {/* Submit Button with white text in light mode */}
        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;
