import { gql } from "@apollo/client";

export const STORE_BY_ID = gql`
  query Restaurant($restaurantId: String) {
    restaurant(id: $restaurantId) {
      zone {
        _id
      }
      location {
        coordinates
      }
      totalWalletAmount
      withdrawnWalletAmount
      currentWalletAmount
      bussinessDetails {
        bankName
        accountNumber
        accountName
        accountCode
      }
    }
  }
`;

export const STORE_EARNINGS = gql`
  query StoreEarnings {
    earnings {
      data {
        grandTotalEarnings {
          storeTotal
        }
        earnings {
          storeEarnings {
            totalEarnings
          }
        }
      }
    }
  }
`;

export const STORE_TRANSACTIONS_HISTORY = gql`
  query TransactionHistory {
    transactionHistory {
      data {
        status
        amountTransferred
        createdAt
      }
    }
  }
`;

export const STORE_CURRENT_WITHDRAW_REQUEST = gql`
  query StoreCurrentWithdrawRequest($storeId: String) {
    storeCurrentWithdrawRequest(storeId: $storeId) {
      _id
      requestAmount
      status
      createdAt
    }
  }
`;

export const STORE_PROFILE = gql`
  query Restaurant($restaurantId: String!) {
    restaurant(id: $restaurantId) {
      _id
      unique_restaurant_id
      orderId
      orderPrefix
      name
      image
      logo
      address
      username
      minimumOrder
      isActive
      isAvailable
      slug
      commissionRate
      tax
      notificationToken
      enableNotification
      shopType
      phone
      hasBusinessDetails
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`;
