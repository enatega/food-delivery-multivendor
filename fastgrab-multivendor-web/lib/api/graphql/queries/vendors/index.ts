import { gql } from "@apollo/client";
import { RESTAURANTS_FRAGMENT } from "../restaurants";

export const TOP_RATED_VENDORS = gql`
  ${RESTAURANTS_FRAGMENT}
  query TopRatedVendors($latitude: Float!, $longitude: Float!) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantPreviewFields
    }
  }
`;
