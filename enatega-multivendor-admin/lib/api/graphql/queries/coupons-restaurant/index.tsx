import { gql } from '@apollo/client';

export const GET_RESTAURANT_COUPONS = gql`
  query GetRestaurantCoupons($restaurantId: String!) {
    restaurantCoupons(restaurantId: $restaurantId) {
      _id
      title
      discount
      enabled
      endDate
      lifeTimeActive
    }
  }
`;
