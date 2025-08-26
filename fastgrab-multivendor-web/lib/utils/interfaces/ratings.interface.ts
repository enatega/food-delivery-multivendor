import { IOrder } from "./orders.interface";

// Props interface for the RatingModal component
export interface IRatingModalProps {
  visible: boolean; // Controls modal visibility
  onHide: () => void; // Function to close the modal
  order: IOrder | null; // Order data to be rated
  onSubmitRating: (
    orderId: string | undefined,
    rating: number,
    comment?: string,
    aspects?: string[]
  ) => void; // Callback for submitting rating
}

// Props interface for the Second step component
export interface IRenderStepTwoProps {
  selectedAspects: string[];
  handleAspectToggle: (aspect: string) => void;
  handleNext: () => void;
  handleSubmitDebounced: () => void;
}


 // Props interface for the third step component
export interface IRenderStepThreeProps {
    selectedAspects: string[];         // Array of selected aspects
    handleAspectToggle: (aspect: string) => void;
    handleSubmitDebounced: () => void;
    comment: string;
    setComment: (value: string) => void;
  }


export interface IRatingOption {
  value: number;                  // Rating value (1-5)
  emoji: string;                  // Emoji representing the rating
  label: string;                  // Text label for the rating
  selected: boolean;              // Whether this option is currently selected
  onSelect: (value: number) => void; // Callback when option is selected
}