import { gql } from "@apollo/client";

export const GET_CUISINES = gql`
  query Cuisines {
    attachedCuisines {
      _id
      name
      description
      image
      shopType
    }
  }
`;

export const NEAR_BY_RESTAURANTS_CUISINES = gql`
  query RestaurantCuisines($latitude: Float, $longitude: Float, $shopType: String) {
    nearByRestaurantsCuisines(
      latitude: $latitude
      longitude: $longitude
      shopType: $shopType
    ) {
        _id
        name
        description
        image
        shopType
    }
  }
`;
