
// Basic user information
export interface IUser {
    _id: string;
    name: string;
    email: string;
    __typename: string;
}

// Order information with associated user
export interface IOrder {
    _id: string;
    user: IUser;
    __typename: string;
}

// Restaurant basic details
export interface IRestaurant {
    _id: string;
    name: string;
    __typename: string;
}

// Complete review structure
export interface IReview {
    _id: string;
    rating: number;
    description?: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
    order: IOrder;
    restaurant: IRestaurant;
    __typename: string;
}

// Container for multiple reviews
export interface IReviewsResult {
    reviews?: IReview[];
    ratings?: number;
    total?: number;
}


export interface IReviewsModalProps {
    restaurantId: string
    visible: boolean
    onHide: () => void
  }