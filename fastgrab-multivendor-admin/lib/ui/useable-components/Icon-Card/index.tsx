import React, { useState } from 'react';
import { Rating } from 'primereact/rating';
import { IProfileCardProps } from '@/lib/utils/interfaces';
import Image from 'next/image';

const ProfileCard: React.FC<IProfileCardProps> = ({
  name,
  orderedItems,
  rating,
  imageSrc,
  reviewContent,
  orderId,
  createdAt,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleReviewClick = () => {
    if (reviewContent) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm mx-auto">
      <div className="flex flex-col md:flex-row items-center w-full">
        <Image
          src={imageSrc}
          alt={`Restaurant image`}
          width={58}
          height={58}
          className="rounded-md mr-4"
        />
        <div className="flex-grow text-center md:text-left">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{orderedItems}</div>
          <div className="text-xs text-gray-400">Order ID: {orderId}</div>
          <div className="text-xs text-gray-400">Date: {createdAt}</div>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center mr-4">
            <Rating value={rating} readOnly cancel={false} />
          </div>
          <button
            onClick={handleReviewClick}
            className={`flex items-center border px-2 py-1 rounded ${
              reviewContent
                ? 'hover:bg-gray-100'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!reviewContent}
          >
            <span className="mr-1">💬</span>
            <span>Review</span>
          </button>
        </div>
      </div>
      {reviewContent && showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <h2 className="text-xl font-semibold mb-4">Review</h2>
            <p className="text-gray-700 mb-8">{reviewContent}</p>
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
