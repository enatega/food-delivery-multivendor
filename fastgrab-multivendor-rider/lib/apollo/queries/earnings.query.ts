import { gql } from "@apollo/client";

export const RIDER_EARNINGS_GRAPH = gql`
  query RiderEarningsGraph(
    $riderId: ID!
    $page: Int
    $limit: Int
    $startDate: String
    $endDate: String
  ) {
    riderEarningsGraph(
      riderId: $riderId
      page: $page
      limit: $limit
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      earnings {
        _id
        earningsArray {
          tip
          orderDetails {
            orderType
            orderId
            paymentMethod
          }
          totalEarnings
          deliveryFee
          date
        }
        totalDeliveries
        totalEarningsSum
        totalHours
        totalTipsSum
        date
      }
    }
  }
`;

export const RIDER_GRAND_TOTAL_EARNINGS = gql`
  query Earnings(
    $userType: UserTypeEnum
    $userId: String
    $orderType: OrderTypeEnum
    $paymentMethod: PaymentMethodEnum
    $pagination: PaginationInput
    $dateFilter: DateFilter
  ) {
    earnings(
      userType: $userType
      userId: $userId
      orderType: $orderType
      paymentMethod: $paymentMethod
      pagination: $pagination
      dateFilter: $dateFilter
    ) {
      data {
        earnings {
          grandTotalEarnings {
            riderTotal
          }
        }
        message
      }
    }
  }
`;
