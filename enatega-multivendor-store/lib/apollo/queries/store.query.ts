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
  query TransactionHistory($userType: UserTypeEnum, $userId: String) {
    transactionHistory(userType: $userType, userId: $userId) {
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
      password
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
      openingTimes {
        day
        times {
          startTime
          endTime
        }
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

export const STORE_ORDERS = gql`
  query Orders {
    restaurantOrders {
      _id
      orderId
      id
      restaurant {
        _id

        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
      }
      items {
        _id
        id
        title
        description
        image
        quantity
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
            title
            description
            price
          }
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user {
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      tipping
      taxationAmount
      status
      paymentStatus
      reason
      isActive
      createdAt
      orderDate
      pickedAt
      deliveryCharges
      isPickedUp
      preparationTime
      acceptedAt
      isRinged
      instructions
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;
