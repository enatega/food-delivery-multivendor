import { restaurantPreviewFragment } from "./resturant/resturant-2.query";

export const topRatedVendorsInfo = `#graphql

  ${restaurantPreviewFragment}
  query TopRatedVendors($latitude: Float!, $longitude: Float!) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantPreviewFields
    }
  }
`;

export const topRatedVendorsInfoPreview = `#graphql
query TopRatedVendors($latitude: Float!, $longitude: Float!) {
  topRatedVendors(latitude: $latitude, longitude: $longitude) {
    _id
    name
    image
    deliveryTime
    tax
    shopType
    reviewData{
        total
        ratings
        reviews{
          _id
          rating
        }
    }
    categories{
      _id
      title
    }
  }
}`;
