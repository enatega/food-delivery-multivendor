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
