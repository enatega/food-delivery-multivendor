"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// Hooks
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
// Components
import RenderStepTwo from "../step-two";
import RenderStepOne from "../step-one";
import RenderStepThree from "../step-three";
// Useable Components
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
// Interfaces
import { IRatingModalProps } from "@/lib/utils/interfaces/ratings.interface";
import { useTranslations } from "next-intl";

/**
 * RatingModal - A multi-step modal component for collecting user ratings for past orders
 *
 * This component handles a 3-step rating flow:
 * 1. Select star rating (1-5)
 * 2. Select aspects (what was good/bad)
 * 3. Add optional comment
 */
export default function RatingModal({
  visible,
  onHide,
  order,
  onSubmitRating,
}: IRatingModalProps) {
  // State management for the multi-step rating process
  const [step, setStep] = useState<1 | 2 | 3>(1); // Track current step in the flow
  const [rating, setRating] = useState<number | null>(null); // Star rating (1-5)
  const [comment, setComment] = useState<string>(""); // User's text feedback
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]); // Selected rating aspects/tags

  const t = useTranslations()
  // Debounced submit function to prevent multiple rapid submissions
  const handleSubmitDebounced = useDebounceFunction(() => {
    if (order && rating !== null) {
      onSubmitRating(order._id, rating, comment, selectedAspects);
      onHide();
    }
  }, 500);

  // Reset all form states when modal visibility changes
  useEffect(() => {
    if (visible) {
      setStep(1);
      setRating(null);
      setComment("");
      setSelectedAspects([]);
    }
  }, [visible]);

  // Updates the star rating state when user selects a rating
  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  // Toggles aspect selection - adds if not present, removes if already selected
  const handleAspectToggle = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect)
        ? prev.filter((a) => a !== aspect)
        : [...prev, aspect]
    );
  };

  // Advances to the next step in the rating flow
  const handleNext = () => {
    if (step === 1 && rating !== null) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      className="m-0"
      width="594px"
    >
      <div className="flex flex-col items-center md:p-6 p-0 pt-16 rounded-xl gap-4">
        {/* Restaurant Image - Shows restaurant profile picture or placeholder */}
        <div className="w-[162px] h-[162px] rounded-full overflow-hidden mb-4">
          {order?.restaurant?.image ? (
            <Image
              src={order.restaurant.image}
              alt={order.restaurant.name || "Restaurant"}
              width={162}
              height={162}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400"
                alt="Restaurant"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Restaurant Name Display */}
        <p className="text-gray-600 ">
          {order?.restaurant?.name || t('restaurant_name_label')}
        </p>

        {/* Modal Title */}
        <h2 className="md:text-2xl text-xl font-bold  text-black">
          {t('how_was_the_delivery_title')}
        </h2>

        {/* Modal Description */}
        <p className="text-gray-600  text-center md:text-lg text-base">
          {t("rating_modal_description")}
        </p>

        {/* Conditional rendering based on current step */}
        {/* Step 1: Rating stars selection */}
        {step === 1 && (
          <RenderStepOne
            rating={rating}
            handleRatingSelect={handleRatingSelect}
            handleNext={handleNext}
          />
        )}
        {/* Step 2: Select aspects/tags about the experience */}
        {step === 2 && (
          <RenderStepTwo
            selectedAspects={selectedAspects}
            handleAspectToggle={handleAspectToggle}
            handleNext={handleNext}
            handleSubmitDebounced={handleSubmitDebounced}
          />
        )}
        {/* Step 3: Add optional comment */}
        {step === 3 && (
          <RenderStepThree
            selectedAspects={selectedAspects}
            handleAspectToggle={handleAspectToggle}
            handleSubmitDebounced={handleSubmitDebounced}
            comment={comment}
            setComment={setComment}
          />
        )}
      </div>
    </CustomDialog>
  );
}
