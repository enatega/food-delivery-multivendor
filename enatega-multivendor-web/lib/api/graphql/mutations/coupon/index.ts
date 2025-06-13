import { gql } from "@apollo/client";

export const VERIFY_COUPON = gql`
  mutation Coupon($coupon: String!) {
    coupon(coupon: $coupon) {
      _id
      title
      discount
      enabled
    }
  }
`;
