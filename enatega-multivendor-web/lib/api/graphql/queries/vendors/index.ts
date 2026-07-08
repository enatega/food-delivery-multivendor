import { gql } from "@apollo/client";
import { RESTAURANTS_CAROUSEL_FRAGMENT } from "../restaurants";

// topRatedVendorsPreview returns `RestaurantCarouselPreview` — use the carousel
// fragment, not RestaurantPreviewFields, or the server rejects it.
export const TOP_RATED_VENDORS = gql`
  ${RESTAURANTS_CAROUSEL_FRAGMENT}
  query TopRatedVendors($latitude: Float!, $longitude: Float!) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantCarouselPreviewFields
    }
  }
`;
