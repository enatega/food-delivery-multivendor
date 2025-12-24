import React, { useState } from 'react';
import { Rating } from 'primereact/rating';
import { IProfileCardProps } from '@/lib/utils/interfaces';
import Image from 'next/image';

const ProfileCard: React.FC<IProfileCardProps> = ({
  name,
  orderedItems,
  rating,
  imageSrc,
  comments,
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
    <div className="flex flex-col items-center p-4 border dark:border-dark-600 rounded-lg shadow-sm mx-auto">
      <div className="flex flex-col md:flex-row items-center w-full">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={`Restaurant image`}
            width={58}
            height={58}
            className="rounded-md mr-4"
          />
        )}
        <div className="basis-[70%] flex-grow text-center md:text-left">
          <div className="font-semibold dark:text-white">
            {name || 'Anonymous'}
          </div>
          <div className="text-sm text-gray-500 dark:text-white">
            {orderedItems || 'No Items'}
          </div>
          {orderId && (
            <div className="text-xs text-gray-400 dark:text-white">
              Order ID: {orderId}
            </div>
          )}
          {createdAt && (
            <div className="text-xs text-gray-400 dark:text-white">
              Date: {createdAt}
            </div>
          )}
        </div>
        <div className="basis-[30%] flex items-center flex-wrap gap-4 justify-center sm:justify-end mt-4 md:mt-0">
          <div className="flex items-center">
            <Rating value={rating ?? 0} readOnly cancel={false} />
          </div>
          <button
            onClick={handleReviewClick}
            className={`flex items-center border dark:border-dark-600 px-2 py-1 rounded ${
              reviewContent
                ? 'hover:bg-gray-100 dark:hover:bg-dark-600'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!reviewContent}
          >
            <span className="mr-1 dark:text-white">💬</span>
            <span className="dark:text-white">Review</span>
          </button>
          <span className="p-2 text-xs rounded-full bg-gray-100">
            {comments || 'No comments'}
          </span>
        </div>
      </div>
      {reviewContent && showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white dark:bg-dark-950 p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <h2 className="text-xl font-semibold mb-4">Review</h2>
            <p className="text-gray-700  dark:text-white mb-8">
              {reviewContent}
            </p>
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
