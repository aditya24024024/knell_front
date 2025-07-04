import { useStateProvider } from '../../context/StateContext';
import { HOST } from '../../utils/constants';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Reviews from './Reviews';
import AddReview from './AddReview';
import { useRouter } from 'next/router';

const Details = () => {
  const [{ gigData, hasOrdered }] = useStateProvider();
  const [currentImage, setCurrentImage] = useState('');
  const [averageRatings, setAverageRatings] = useState('0');
  const router = useRouter();

  useEffect(() => {
    if (gigData) {
      setCurrentImage(gigData.images[0]);
    }
  }, [gigData]);

  useEffect(() => {
    if (gigData?.reviews?.length) {
      const total = gigData.reviews.reduce((acc, { rating }) => acc + rating, 0);
      setAverageRatings((total / gigData.reviews.length).toFixed(1));
    }
  }, [gigData]);

  if (!gigData || !currentImage) return null;

  return (
    <div className="col-span-2 flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#404145]">{gigData.title}</h2>

      {/* Creator Info */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/profile/${gigData.createdBy.username}`)}
      >
        {gigData.createdBy.profileImage ? (
          <Image
            src={`${gigData.createdBy.profileImage}`}
            alt="profile"
            height={40}
            width={40}
            className="rounded-full"
          />
        ) : (
          <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
            <span className="text-white text-lg font-bold">
              {gigData.createdBy.email[0].toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-[#27272a]">
            {gigData.createdBy.fullName}
          </span>
          <span className="text-sm text-[#74767e] hover:underline text-blue-600">
            @{gigData.createdBy.username}
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${
                Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-yellow-500">{averageRatings}</span>
          <span className="text-[#27272a]">({gigData.reviews.length})</span>
        </div>
      </div>

      {/* Gig Images */}
      <div className="flex flex-col gap-4">
        <div className="w-full max-w-[800px] overflow-hidden rounded">
          <Image
            src={`${currentImage}`}
            alt="Gig"
            height={800}
            width={800}
            className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-500 object-cover"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          {gigData.images.map((img) => (
            <Image
              key={img}
              src={`${img}`}
              alt="Thumbnail"
              height={100}
              width={100}
              onClick={() => setCurrentImage(img)}
              className={`cursor-pointer rounded border transition-all duration-300 ${
                currentImage === img ? 'border-[#1DBF73]' : 'opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Gig Description */}
      <div>
        <h3 className="text-2xl font-semibold text-[#404145] my-4">About this Gig</h3>
        <p className="text-[#404145] leading-relaxed">{gigData.description}</p>
      </div>

      {/* About Seller */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/profile/${gigData.createdBy.username}`)}
      >
        <h3 className="text-2xl font-semibold text-[#404145] my-4">About the Seller</h3>
        <div className="flex gap-4 items-center">
          {gigData.createdBy.profileImage ? (
            <Image
              src={`${gigData.createdBy.profileImage}`}
              alt="profile"
              height={100}
              width={100}
              className="rounded-full"
            />
          ) : (
            <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full">
              <span className="text-white text-2xl">
                {gigData.createdBy.email[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                {gigData.createdBy.fullName}
              </span>
              <span className="text-sm text-[#74767e] hover:underline text-blue-600">
                @{gigData.createdBy.username}
              </span>
            </div>
            <p className="text-[#404145] mt-1">{gigData.createdBy.description}</p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`${
                    Math.ceil(gigData.averageRating || 0) >= star
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-[#74767e] ml-1">({gigData.totalReviews})</span>
            </div>
          </div>
        </div>
      </div>
      
      <Reviews />
      {hasOrdered && <AddReview />}
    </div>
  );
};

export default Details;
