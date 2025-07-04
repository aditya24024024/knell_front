import React,{ useState } from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { HOST } from '../../utils/constants';

const SearchGridItem = ({ gig }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const calculateRatings = () => {
    const { reviews } = gig;
    if (!reviews?.length) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    // isLoading?
    //     (<div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 animate-pulse">
    //       <span className="text-sm text-gray-500">Loading...</span>
    //     </div>
    //   ):
    // (
          // onLoadingComplete={() => setIsLoading(false)}
      <div
      className="w-full sm:max-w-[300px] flex flex-col gap-2 p-2 cursor-pointer hover:shadow-md transition-all rounded-lg"
      onClick={() => router.push(`/gig/${gig.id}`)}
    >
      {/* Gig Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-52 rounded-xl overflow-hidden">
        <Image
          src={`${gig.images[0]}`}
          alt="Gig Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-2 mt-2">
        {gig.createdBy.profileImage ? (
          <Image
            src={`${gig.createdBy.profileImage}`}
            alt="Profile"
            height={30}
            width={30}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="bg-purple-500 h-[30px] w-[30px] flex items-center justify-center rounded-full">
            <span className="text-white text-sm font-semibold">
              {gig.createdBy.email[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <span
  onClick={(e) => {
    e.stopPropagation(); // prevents the parent `onClick` from firing
    router.push(`/profile/${gig.createdBy.username}`);
  }}
  className="text-sm sm:text-base font-medium text-blue-600 hover:underline cursor-pointer"
>
  {gig.createdBy.username}
</span>
      </div>

      {/* Gig Title */}
      <p className="line-clamp-2 text-[#404145] text-sm sm:text-base">
        {gig.title}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-400 text-sm">
        <FaStar className="text-base" />
        <strong>{calculateRatings()}</strong>
        <span className="text-[#74767e] text-xs">
          ({gig.reviews?.length || 0})
        </span>
      </div>

      {/* Price */}
      <div>
        <strong className="font-semibold text-sm sm:text-base">
          From ₹{gig.price}
        </strong>
      </div>
    </div>
  // )
  );
};

export default SearchGridItem;
