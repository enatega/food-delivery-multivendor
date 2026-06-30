import { gql } from '@apollo/client';

export const GET_RESTAURANT_COUPONS = gql`
  query GetRestaurantCoupons($restaurantId: String!) {
    restaurantCoupons(restaurantId: $restaurantId) {
      _id
      title
      discount
      enabled
    }
  }
`;

export const GET_RESTAURANT_COUPONS_PAGINATED = gql`
  query RestaurantCouponsPaginated(
    $restaurantId: String!
    $page: Int
    $limit: Int
    $search: String
    $enabled: Boolean
  ) {
    restaurantCouponsPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
      enabled: $enabled
    ) {
      data {
        _id
        title
        discount
        enabled
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
