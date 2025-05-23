import { gql } from '@apollo/client';

export const CREATE_RESTAURANT_COUPON = gql`
  mutation createRestaurantCoupon(
    $restaurantId: ID!
    $couponInput: CouponInput!
  ) {
    createRestaurantCoupon(
      restaurantId: $restaurantId
      couponInput: $couponInput
    ) {
      _id
      title
      discount
      enabled
      endDate
      lifeTimeActive
      startDate
    }
  }
`;

export const EDIT_RESTAURANT_COUPON = gql`
  mutation EditRestaurantCoupon(
    $restaurantId: ID!
    $couponInput: CouponInput!
  ) {
    editRestaurantCoupon(
      restaurantId: $restaurantId
      couponInput: $couponInput
    ) {
      _id
      title
      discount
      enabled
      endDate
      lifeTimeActive
      startDate
    }
  }
`;

export const DELETE_RESTAURANT_COUPON = gql`
  mutation DeleteRestaurantCoupon($restaurantId: ID!, $couponId: ID!) {
    deleteRestaurantCoupon(restaurantId: $restaurantId, couponId: $couponId)
  }
`;
