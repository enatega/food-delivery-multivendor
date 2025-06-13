"use client";
// Import necessary dependencies
import { Rating } from "primereact/rating"; // UI component for star ratings
import useReviews from "@/lib/hooks/useReviews"; // Custom hook to fetch restaurant reviews
import { useMemo } from "react"; // React hook for memoizing expensive calculations
// Skeleton Components
import CustomReviewModal from "../custom-skeletons/reviews.card"; // Loading skeleton for reviews
// Helper Functions
import { formatDateForCreatedAt } from "@/lib/utils/methods"; // Date formatting utility
// Type Definitions
import {
  IReview,
  IReviewsModalProps,
} from "@/lib/utils/interfaces/reviews.interface"; // TypeScript interfaces
// Useable Components
import { Dialog } from "primereact/dialog";

/**
 * Modal component to display restaurant reviews
 * @param visible - Controls whether the modal is shown
 * @param onHide - Function to call when closing the modal
 * @param restaurantId - ID of the restaurant to fetch reviews for
 */

const ReviewsModal = ({
  visible,
  onHide,
  restaurantId,
}: IReviewsModalProps) => {
  // Fetch reviews data for the specified restaurant
  const { data, loading } = useReviews(restaurantId);

  // Extract the review result from the nested data structure
  const reviewResult = data?.reviewsByRestaurant || {
    reviews: [],
    ratings: 0,
    total: 0,
  };

  // Check if there are any reviews to display
  const hasReviews = reviewResult.total > 0 && reviewResult.reviews.length > 0;

  // Methods

  /**
   * Calculate the average rating for the restaurant
   * Uses the provided average if available, otherwise calculates from individual reviews
   */
  const averageRating = useMemo(() => {
    if (!hasReviews) return 0;

    // If ratings is already the average, use it

    // This part is commented out because the API is sending incorrect total ratings
    // if (reviewResult.ratings) return reviewResult.ratings

    // Otherwise calculate from individual reviews

    const sum = reviewResult.reviews.reduce(
      (acc: number, review: IReview) => acc + review.rating,
      0
    );
    return sum / reviewResult.reviews.length;
  }, [reviewResult, hasReviews]);

  // Generate rating breakdown (5 to 1 stars)

  /**
   * Calculate the distribution of ratings (how many 5-star, 4-star, etc. reviews)
   * Returns an array with the count and percentage for each star rating
   */
  const ratingBreakdown = useMemo(() => {
    // If we don't have any reviews, just return an empty array
    if (!hasReviews) return [];

    // Initialize counters for each star rating
    const starCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    // Count the number of reviews for each star rating
    reviewResult.reviews.forEach((review: IReview) => {
      // Get the star rating from the review (1-5)
      const rating = review.rating;

      // Make sure it's a valid rating between 1-5
      if (rating >= 1 && rating <= 5) {
        // Increment the count for this star rating
        starCounts[rating as keyof typeof starCounts]++;
      }
    });

    // Calculate percentage distribution
    const totalReviews = reviewResult.reviews.length;

    // Create results array for the star distribution
    const results: { stars: number; count: number; percentage: number }[] = [];

    // Process each star rating from highest (5) to lowest (1)
    for (let stars = 5; stars >= 1; stars--) {
      const count = starCounts[stars as keyof typeof starCounts];
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

      results.push({
        stars,
        count,
        percentage,
      });
    }

    return results;
  }, [reviewResult, hasReviews]);

  /**
   * Helper function to render star ratings with consistent styling
   * @param rating - Number of stars to display (1-5)
   */
  const renderStars = (rating: number) => {
    return (
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
  };

  // Show loading skeleton while data is being fetched
  if (loading && visible) return <CustomReviewModal />;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className="md:m-10 m-2 z-[100] md:w-[905px] w-full max-h-[80vh]"
      // width="905px"
     
    >
      <div className="md:p-2 md:pt-0 pt-3 p-1 ">
        {
          hasReviews ?
            <>
              {/* Overall Rating */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border p-4 rounded-md shadow-sm">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl md:text-5xl font-semibold text-gray-700">
                    {averageRating?.toFixed(2)}
                  </h1>
                  <p className="text-gray-500 mt-1 font-normal text-xl md:text-2xl">
                    ({reviewResult?.reviews?.length?.toLocaleString()})
                  </p>
                  <div className="flex items-center mt-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="w-full md:w-3/5">
                  {ratingBreakdown.map((item) => (
                    <div key={item?.stars} className="flex items-center mb-2">
                      <span className="w-6 text-right mr-2">{item?.stars}</span>
                      <span className="text-amber-500">
                        <Rating
                          value={1}
                          stars={1}
                          readOnly
                          cancel={false}
                          className="flex scale-75 origin-left"
                          pt={{ onIcon: { className: "text-amber-500" } }}
                        />
                      </span>
                      <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${item?.percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-600">
                        {item?.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviewResult?.reviews?.map((review: IReview) => (
                  <div
                    key={review?._id}
                    className=" border p-4 rounded-md shadow-sm"
                  >
                    <h3 className="text-gray-700 font-medium text-lg md:text-2xl mb-1">
                      {review?.order?.user?.name || "Anonymous User"}
                    </h3>
                    <div className="flex items-center mb-2">
                      {renderStars(review?.rating)}
                      <span className="ml-2 text-gray-500 font-normal md:text-[16px] text-[12px]">
                        {formatDateForCreatedAt(review?.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-500 font-normal md:text-lg text-sm">
                      {review?.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
            // No reviews state
          : <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-amber-500 mb-4">
                <Rating
                  value={0}
                  readOnly
                  cancel={false}
                  className="flex justify-center"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Reviews Yet
              </h2>
              <p className="text-gray-600 max-w-md mb-6">
                This restaurant doesn&apos;t have any reviews yet.
              </p>
            </div>

        }
      </div>
    </Dialog>
  );
};

export default ReviewsModal;
