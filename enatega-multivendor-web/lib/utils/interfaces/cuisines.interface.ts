export interface ICuisinesResponse {
  nearByRestaurantsCuisines: ICuisinesData[];
}

export interface ICuisinesData {
  _id: string;
  name: string;
  description?: string;
  image: string;
  shopType: string;
}

export interface ICuisinesSectionProps {
  title: string;
  data: ICuisinesData[];
  loading: boolean;
  error: boolean
}
