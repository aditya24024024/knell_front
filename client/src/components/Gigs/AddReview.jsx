import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";
import { ADD_REVIEW } from "../../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function AddReview() {
  const [{}, dispatch] = useStateProvider();
  const [data, setData] = useState({ reviewText: "", rating: 0 });
  const router = useRouter();
  const { gigid } = router.query;

  const addReview = async () => {
    try {
      const response = await axios.post(
        `${ADD_REVIEW}/${gigid}`,
        { ...data },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setData({ reviewText: "", rating: 0 });
        dispatch({
          type: reducerCases.ADD_REVIEW,
          newReview: response.data.newReview,
        });
      }
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <div className="mb-10 w-full">
      <h3 className="text-xl sm:text-2xl my-5 font-semibold text-[#404145]">
        Leave a Review
      </h3>
      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {/* Review Text */}
        <textarea
          name="reviewText"
          id="reviewText"
          rows="4"
          onChange={(e) => setData({ ...data, reviewText: e.target.value })}
          value={data.reviewText}
          className="p-3 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your review here..."
        ></textarea>

        {/* Star Rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`cursor-pointer transition-colors ${
                data.rating >= num ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setData({ ...data, rating: num })}
              title={`${num} Star${num > 1 ? "s" : ""}`}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={addReview}
          className="bg-[#1DBF73] text-white px-6 py-2 rounded font-medium hover:bg-[#17a865] transition-colors w-fit"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default AddReview;
