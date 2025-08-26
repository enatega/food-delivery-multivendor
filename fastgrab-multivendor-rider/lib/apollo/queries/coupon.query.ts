export const getCoupon = `#graphql
mutation Coupon($coupon:String!){
    coupon(coupon:$coupon){
      _id
      title
      discount
      enabled
    }
  }`;
