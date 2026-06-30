import { gql } from '@apollo/client';

export const GET_COUPONS = gql`
  query Coupons {
    coupons {
      _id
      title
      discount
      enabled
      startDate
      endDate
      lifeTimeActive
    }
  }
`;

export const GET_COUPONS_PAGINATED = gql`
  query CouponsPaginated(
    $page: Int
    $limit: Int
    $search: String
    $enabled: Boolean
    $startDate: String
    $endDate: String
  ) {
    couponsPaginated(
      page: $page
      limit: $limit
      search: $search
      enabled: $enabled
      startDate: $startDate
      endDate: $endDate
    ) {
      data {
        _id
        title
        discount
        enabled
        startDate
        endDate
        lifeTimeActive
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
