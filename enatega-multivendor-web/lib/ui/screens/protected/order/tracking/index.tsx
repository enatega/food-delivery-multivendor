"use client";

// Components
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import GoogleMapTrackingComponent from "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp";
import TrackingOrderDetails from "../../../../screen-components/protected/order-tracking/components/tracking-order-details";
import TrackingHelpCard from "../../../../screen-components/protected/order-tracking/components/tracking-help-card";
import TrackingStatusCard from "@/lib/ui/screen-components/protected/order-tracking/components/tracking-status-card";
import TrackingOrderDetailsDummy from "../../../../screen-components/protected/order-tracking/components/tracking-order-details-dummy";

import useTracking from "@/lib/ui/screen-components/protected/order-tracking/services/useTracking";
import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_REVIEW_ORDER, GET_USER_PROFILE } from "@/lib/api/graphql";
import useReviews from "@/lib/hooks/useReviews";
import { IReview } from "@/lib/utils/interfaces";
import useToast from "@/lib/hooks/useToast";
import { RatingModal } from "@/lib/ui/screen-components/protected/profile";
import ReactConfetti from "react-confetti";
import ChatRider from "@/lib/ui/screen-components/protected/order-tracking/components/ChatRider";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";

interface IOrderTrackingScreenProps {
  orderId: string;
}

export default function OrderTrackingScreen({
  orderId,
}: IOrderTrackingScreenProps) {
  //states
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showChat, setShowChat] = useState(false)

  //Queries and Mutations
  const { isLoaded } = useContext(GoogleMapsContext);
  const {
    orderTrackingDetails,
    isOrderTrackingDetailsLoading,
    subscriptionData,
    trackingData,
  } = useTracking({ orderId: orderId });



  const { showToast } = useToast();

  const { data: profile } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-only",
  });

  const [mutate] = useMutation(ADD_REVIEW_ORDER, {
    onCompleted,
    onError,
  });

  function onCompleted() {
    showToast({
      type: "success",
      title: "Rating",
      message: "Rating submitted successfully",
      duration: 3000,
    });


    // Add a small delay before navigation
    // Use window.location for a hard redirect
    setTimeout(() => {
      window.location.href = "/profile/order-history";
    }, 1000); // Increased timeout to ensure toast has time to display
  }

  function onError() {
    showToast({
      type: "error",
      title: "Rating",
      message: "Failed to submit rating",
      duration: 3000,
    });
  }
  const mergedOrderDetails =
    orderTrackingDetails && subscriptionData ?
      {
        ...orderTrackingDetails,
        ...subscriptionData,
        rider: subscriptionData.rider || orderTrackingDetails.rider,
        eta:
          trackingData?.eta ||
          subscriptionData.eta ||
          orderTrackingDetails.eta,
      }
      : orderTrackingDetails
        ? { ...orderTrackingDetails, eta: trackingData?.eta || orderTrackingDetails.eta }
        : orderTrackingDetails;

  const destination = useMemo(() => {
    const coordinates = mergedOrderDetails?.deliveryAddress?.location?.coordinates;
    const lat = Number(coordinates?.[1]);
    const lng = Number(coordinates?.[0]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [mergedOrderDetails?.deliveryAddress?.location?.coordinates]);
  const showLiveMap =
    !mergedOrderDetails?.isPickedUp &&
    mergedOrderDetails?.orderStatus === "PICKED" &&
    Boolean(destination);

  // Get restaurant ID for reviews query
  const restaurantId = useMemo(
    () => mergedOrderDetails?.restaurant?._id,
    [mergedOrderDetails?.restaurant?._id]
  );

  // Fetch reviews data for the specified restaurant
  const { data: reviewsData, refetch } = useReviews(restaurantId);

  // Check if the user has already reviewed the order
  // Memoize the check for existing user review
  const hasUserReview = useMemo(() => {
    if (
      !reviewsData?.reviewsByRestaurant?.reviews ||
      !profile?.profile?.email
    ) {
      return false;
    }
    return reviewsData.reviewsByRestaurant.reviews.some(
      (review: IReview) =>
        review?.order?.user?.email === profile.profile.email &&
        review?.order?._id === orderId
    );
  }, [
    reviewsData?.reviewsByRestaurant?.reviews,
    profile?.profile?.email,
    orderId,
  ]);

  // handle submit rating
  const handleSubmitRating = async (
    orderId: string | undefined,
    ratingValue: number,
    comment?: string,
    aspects: string[] = []
  ) => {
    const reviewDescription = comment?.trim() || undefined;
    const reviewComments =
      aspects?.filter(Boolean).join(", ") || undefined;

    // Here you would  call an API to save the rating
    try {
      await mutate({
        variables: {
          order: orderId,
          description: reviewDescription,
          rating: ratingValue,
          comments: reviewComments,
        },
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
    }

    // Close the modal
    setShowRatingModal(false);
  };

  //useEffects

  // useEffect to handle order status changes
  useEffect(() => {
    if (mergedOrderDetails?.orderStatus == 'PICKED') {
      setShowChat(true)
    }

    if (mergedOrderDetails?.orderStatus == "DELIVERED") {
      // add timer
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 4000); // 4 seconds delay before showing the modal
      return () => clearTimeout(timer); // Clear timeout on component unmount
    } else if (mergedOrderDetails?.orderStatus == "ACCEPTED") {
      setShowConfetti(true);

      // Reset confetti after a longer delay
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [mergedOrderDetails?.orderStatus]);

  // useEffect to handle subscription data changes
  useEffect(() => {
    if (mergedOrderDetails?.restaurant?._id) {
      refetch();
    }
  }, [mergedOrderDetails?.restaurant?._id, isOrderTrackingDetailsLoading]);

  return (
    <>
      {showConfetti && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 10000,
            }}
          >
            <ReactConfetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={1000}
              gravity={0.3}
            />
          </div>
        </>
      )}
      <RatingModal
        visible={showRatingModal && !hasUserReview}
        onHide={() => setShowRatingModal(false)}
        order={orderTrackingDetails}
        onSubmitRating={handleSubmitRating}
      />
      <div className="w-screen h-full flex flex-col pb-20 dark:bg-gray-900 dark:text-gray-100">
        <div className="scrollable-container flex-1">
          {/* Google Map for Tracking */}
          {showLiveMap && destination && (
            <GoogleMapTrackingComponent
              isLoaded={isLoaded}
              destination={destination}
              eta={mergedOrderDetails?.eta}
              riderLocation={trackingData?.riderLocation}
            />
          )}

          {/* Main Content with increased gap from map */}
          <div className="mt-8 md:mt-10">
            <PaddingContainer>
              {/* Status Card and Help Card in the same row */}
              <div className="flex flex-col md:flex-row md:items-start items-center justify-between gap-6 mb-8">
                {/* Order Status Card */}
                {!isOrderTrackingDetailsLoading && mergedOrderDetails && (
                  <TrackingStatusCard
                    orderTrackingDetails={mergedOrderDetails}
                    trackingData={trackingData}
                  />
                )}

                {/* Help Card - positioned on the left */}
                <div className="md:ml-0 w-full md:w-auto md:flex-none">
                  <TrackingHelpCard />
                  {showChat &&
                    <ChatRider orderId={orderId} customerId={profile?.profile?._id} />

                  }
                </div>
              </div>

              {/* Order Details - Full width to match status card */}
              <div className="flex justify-center md:justify-start">
                {isOrderTrackingDetailsLoading ?
                  <TrackingOrderDetailsDummy />
                  : <TrackingOrderDetails
                    orderTrackingDetails={mergedOrderDetails}
                  />
                }
              </div>
            </PaddingContainer>
          </div>
        </div>
      </div>
    </>
  );
}
