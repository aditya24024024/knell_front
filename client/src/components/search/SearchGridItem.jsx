import React from 'react'
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/router";
import { HOST, IMAGES_URL } from '../../utils/constants';

const SearchGridItem = ({ gig }) => {
  const router = useRouter();

  const calculateRatings = () => {
    const { reviews } = gig;
    let rating = 0;
    if (!reviews?.length) return 0;
    reviews.forEach((review) => rating += review.rating);
    return (rating / reviews.length).toFixed(1);
  };

  return (
    <div
      className="w-full sm:max-w-[300px] flex flex-col gap-2 p-2 cursor-pointer mb-8"
      onClick={() => router.push(`/gig/${gig.id}`)}
    >
      {/* Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-52">
        <Image
          src={`${IMAGES_URL}/${gig.images[0]}`}
          alt="gig"
          fill
          className="rounded-xl object-cover"
        />
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-2 mt-1">
        {gig.createdBy.profileImage ? (
          <Image
            src={HOST + "/" + gig.createdBy.profileImage}
            alt="profile"
            height={30}
            width={30}
            className="rounded-full"
          />
        ) : (
          <div className="bg-purple-500 h-7 w-7 flex items-center justify-center rounded-full">
            <span className="text-sm text-white font-medium">
              {gig.createdBy.email[0].toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm sm:text-base font-medium">
          {gig.createdBy.username}
        </span>
      </div>

      {/* Gig Title */}
      <p className="line-clamp-2 text-[#404145] text-sm sm:text-base">{gig.title}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-400 text-sm">
        <FaStar className="text-base" />
        <strong>{calculateRatings()}</strong>
        <span className="text-[#74767e] text-xs">({gig.reviews.length})</span>
      </div>

      {/* Price */}
      <div>
        <strong className="font-semibold text-sm sm:text-base">From ₹{gig.price}</strong>
      </div>
    </div>
  );
};

export default SearchGridItem;
