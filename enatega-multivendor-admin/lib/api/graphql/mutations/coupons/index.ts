import { gql } from '@apollo/client';

export const CREATE_COUPON = gql`
  mutation CreateCoupon($couponInput: CouponInput!) {
    createCoupon(couponInput: $couponInput) {
      _id
      title
      discount
      enabled
      startDate
      endDate
    }
  }
`;
export const EDIT_COUPON = gql`
  mutation editCoupon($couponInput: CouponInput!) {
    editCoupon(couponInput: $couponInput) {
      _id
      title
      discount
      enabled
      startDate
      endDate
    }
  }
`;
export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: String!) {
    deleteCoupon(id: $id)
  }
`;
