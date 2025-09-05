"use client";

import { Rating } from "primereact/rating";
import useReviews from "@/lib/hooks/useReviews";
import { useMemo } from "react";
import CustomReviewModal from "../custom-skeletons/reviews.card";
import { formatDateForCreatedAt } from "@/lib/utils/methods";
import {
  IReview,
  IReviewsModalProps,
} from "@/lib/utils/interfaces/reviews.interface";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";

const ReviewsModal = ({
  visible,
  onHide,
  restaurantId,
}: IReviewsModalProps) => {
  const { data, loading } = useReviews(restaurantId);
  const reviewResult = data?.reviewsByRestaurant || {
    reviews: [],
    ratings: 0,
    total: 0,
  };
  const hasReviews = reviewResult.total > 0 && reviewResult.reviews.length > 0;

  const averageRating = useMemo(() => {
    if (!hasReviews) return 0;
    const sum = reviewResult.reviews.reduce(
      (acc: number, review: IReview) => acc + review.rating,
      0
    );
    return sum / reviewResult.reviews.length;
  }, [reviewResult, hasReviews]);

  const ratingBreakdown = useMemo(() => {
    if (!hasReviews) return [];
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewResult.reviews.forEach((review: IReview) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) starCounts[rating]++;
    });
    const totalReviews = reviewResult.reviews.length;
    return Object.entries(starCounts)
      .reverse()
      .map(([stars, count]) => ({
        stars: Number(stars),
        count,
        percentage: totalReviews ? Math.round((count / totalReviews) * 100) : 0,
      }));
  }, [reviewResult, hasReviews]);

  const renderStars = (rating: number) => (
    <Rating
      value={rating}
      readOnly
      cancel={false}
      className="flex"
      pt={{
        onIcon: { className: "text-amber-500" },
        offIcon: { className: "text-amber-500" },
      }}
    />
  );

  if (loading && visible) return <CustomReviewModal />;

  return (
    <Dialog
      contentClassName="dark:bg-gray-800 dark:text-gray-300"
      headerClassName="dark:bg-gray-800 dark:text-gray-300"
      visible={visible}
      onHide={onHide}
      className="z-[100] w-full max-w-screen-sm md:w-[90%] lg:w-[900px] max-h-[85vh] rounded-xl overflow-y-auto overflow-x-hidden shadow-lg mx-1 sm:mx-auto md:mx-auto"
    >
      <div className="p-4 md:p-8 space-y-6">
        {hasReviews ? (
          <>
            {/* Average Rating & Breakdown */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow-sm bg-white dark:bg-gray-900">
              <div className="w-full md:w-1/3">
              <h1 className="text-3xl md:text-5xl font-semibold text-gray-700 dark:text-gray-200">
                  {averageRating.toFixed(2)}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-normal text-xl md:text-2xl">
                  {reviewResult.reviews.length.toLocaleString()} reviews
                </p>
                <div className="mt-2">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>

              <div className="w-full md:w-2/3 space-y-2">
                {ratingBreakdown.map(({ stars, percentage }) => (
                  <div
                    key={stars}
                    className="flex flex-wrap items-center gap-2 md:gap-3"
                  >
                    <span className="w-6 text-right mr-2 dark:text-gray-300">
                      {stars}
                    </span>
                    <Rating
                      value={1}
                      stars={1}
                      readOnly
                      cancel={false}
                      className="scale-75"
                      pt={{ onIcon: { className: "text-amber-500" } }}
                    />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full min-w-[40%]">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {reviewResult.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-lg p-4 md:p-5 shadow-sm bg-white dark:bg-gray-900"
                >
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {review.order?.user?.name || "Anonymous User"}
                    </h3>
                    <span className="text-xs rtl:mr-2 md:text-sm text-gray-400 dark:text-gray-400 whitespace-nowrap">
                      {formatDateForCreatedAt(review.createdAt)}
                    </span>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base break-words">
                    {review.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="text-[3.5rem] animate-bounce mb-4">📭</div>
            <h2 className="text-xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Oops! No feedback yet.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs md:max-w-md text-sm md:text-base">
              Be the first to share your experience and help others make better
              choices!
            </p>
          </motion.div>
        )}
      </div>
    </Dialog>
  );
};

export default ReviewsModal;
