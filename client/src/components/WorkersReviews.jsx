import React, { useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "./ui/separator";

const WorkersReviews = ({ WorkersId }) => {
  const [reviews, setReviews] = useState([]);
  const API_END_POINT = "https://rozgar-rpk0.onrender.com/api/v1/Workers";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchReviews();
  }, [WorkersId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_END_POINT}/reviews/${WorkersId}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <div className="flex items-center justify-center h-32 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {review.userId.fullname[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {review.userId.fullname}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkersReviews;