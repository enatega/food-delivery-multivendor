import { gql } from '@apollo/client';

export const GET_EARNING = gql`
  query GetEarning(
    $userId: String
    $userType: UserTypeEnum
    $orderType: OrderTypeEnum
    $paymentMethod: PaymentMethodEnum
    $pageSize: Int!
    $pageNo: Int!
    $startingDate: String
    $endingDate: String
    $search: String
  ) {
    earnings(
      userId: $userId
      userType: $userType
      orderType: $orderType
      paymentMethod: $paymentMethod
      search: $search
      pagination: { pageSize: $pageSize, pageNo: $pageNo }
      dateFilter: { starting_date: $startingDate, ending_date: $endingDate }
    ) {
      success
      message
      data {
        earnings {
          _id
          orderId
          orderType
          paymentMethod
          createdAt
          updatedAt
          platformEarnings {
            marketplaceCommission
            deliveryCommission
            tax
            platformFee
            totalEarnings
          }
          riderEarnings {
            riderId {
              _id
              name
              username
            }
            deliveryFee
            tip
            totalEarnings
          }
          storeEarnings {
            storeId {
              _id
              name
              username
            }
            orderAmount
            totalEarnings
          }
        }
        grandTotalEarnings {
          platformTotal
          riderTotal
          storeTotal
        }
      }
      pagination {
        total
      }
    }
  }
`;

export const GET_EARNING_FOR_STORE = gql`
  query GetEarning(
    $userId: String
    $userType: UserTypeEnum
    $orderType: OrderTypeEnum
    $paymentMethod: PaymentMethodEnum
    $pageSize: Int!
    $pageNo: Int!
    $search: String
    $startingDate: String
    $endingDate: String
  ) {
    earnings(
      userId: $userId
      userType: $userType
      orderType: $orderType
      paymentMethod: $paymentMethod
      search: $search
      pagination: { pageSize: $pageSize, pageNo: $pageNo }
      dateFilter: { starting_date: $startingDate, ending_date: $endingDate }
    ) {
      success
      message
      data {
        earnings {
          _id
          orderId
          orderType
          paymentMethod
          createdAt
          updatedAt
          riderEarnings {
            riderId {
              _id
              name
              username
            }
            deliveryFee
            tip
            totalEarnings
          }
          storeEarnings {
            storeId {
              _id
              name
              username
            }
            orderAmount
            totalEarnings
          }
        }
        grandTotalEarnings {
          riderTotal
          storeTotal
        }
      }
      pagination {
        total
      }
    }
  }
`;
