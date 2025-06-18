import { useStateProvider } from "../../context/StateContext";
import { HOST } from "../../utils/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

function Reviews() {
  const [{ gigData }] = useStateProvider();
  const [averageRating, setAverageRating] = useState("0.0");

  useEffect(() => {
    if (gigData?.reviews?.length) {
      const total = gigData.reviews.reduce((acc, { rating }) => acc + rating, 0);
      setAverageRating((total / gigData.reviews.length).toFixed(1));
    }
  }, [gigData]);

  if (!gigData) return null;

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-medium text-[#404145] mb-6">Reviews</h3>

      {/* Header Info */}
      <div className="flex items-center flex-wrap gap-3 mb-6">
        <p className="text-[#62646a] text-md">{gigData.reviews?.length} reviews for this Gig</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={Math.ceil(averageRating) >= star ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-[#62646a]">{averageRating}</span>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="flex flex-col gap-8">
        {gigData.reviews?.map((review) => (
          <div className="flex gap-4 border-t pt-6" key={review.id}>
            {/* Reviewer Profile */}
            <div className="min-w-[40px]">
              {review.reviewer.profileImage ? (
                <Image
                  src={`${HOST}/${review.reviewer.profileImage}`}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-purple-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <span className="text-white font-semibold text-lg">
                    {review.reviewer.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Review Content */}
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-md font-semibold text-[#404145]">{review.reviewer.fullName}</h4>
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={review.rating >= star ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#62646a]">{review.rating}</span>
              </div>
              <p className="text-[#404145] text-sm leading-relaxed">{review.reviewText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
