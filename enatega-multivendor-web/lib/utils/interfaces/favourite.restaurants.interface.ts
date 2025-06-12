// User Favourite Restaurants Interfaces

export interface IUserReviewAuthor {
    _id?: string;
    name?: string;
    email?: string;
}

export interface IUserReview {
    _id?: string;
    order?: {
        user?: IUserReviewAuthor;
    };
    rating?: number;
    description?: string;
    createdAt?: string;
}

export interface IReviewData {
    total?: number;
    ratings?: number;
    reviews?: IUserReview[];
}

export interface IRestaurantOpeningTime {
    day?: string;
    times?: {
        startTime?: string;
        endTime?: string;
    }[];
}

export interface IRestaurantVariation {
    _id?: string;
    title?: string;
    price?: number;
    discounted?: number;
    addons?: string[];
}

export interface IRestaurantFood {
    _id?: string;
    title?: string;
    image?: string;
    description?: string;
    subCategory?: string;
    variations?: IRestaurantVariation[];
}

export interface IRestaurantCategory {
    _id?: string;
    title?: string;
    foods?: IRestaurantFood[];
}

export interface IRestaurantOption {
    _id?: string;
    title?: string;
    description?: string;
    price?: number;
}

export interface IRestaurantAddon {
    _id?: string;
    options?: string;
    title?: string;
    description?: string;
    quantityMinimum?: number;
    quantityMaximum?: number;
}

export interface IFavouriteRestaurantItem {
    _id?: string;
    orderId?: string;
    orderPrefix?: string;
    name?: string;
    isActive?: boolean;
    slug?: string;
    shopType?: string;
    image?: string;
    address?: string;
    location?: {
        coordinates?: number[];
    };
    deliveryTime?: string;
    minimumOrder?: number;
    tax: number | string;
    isAvailable?: boolean;
    reviewCount?: number;
    reviewAverage?: number;
    reviewData?: IReviewData;
    categories?: IRestaurantCategory[];
    options?: IRestaurantOption[];
    addons?: IRestaurantAddon[];
    rating?: number;
    openingTimes?: IRestaurantOpeningTime[];
}

export interface IUserFavouriteQueryVariables {
    latitude?: number;
    longitude?: number;
}

export interface IUserFavouriteQueryResponse {
    userFavourite?: IFavouriteRestaurantItem[];
}

export interface IHeaderFavourite {
    title: string;
    showSeeAll?: boolean;
    onSeeAllClick?: () => void;
}

export interface IFavoriteCardProps {
    item: IFavouriteRestaurantItem;
}
