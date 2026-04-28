import { gql } from "@apollo/client";

export const RIDER_BY_ID = gql`
  query Rider($id: String) {
    rider(id: $id) {
      _id
      location {
        coordinates
      }
      zone {
        _id
      }
      currentWalletAmount
      totalWalletAmount
      withdrawnWalletAmount
    }
  }
`;

export const RIDER_EARNINGS = gql`
  query RiderEarnings {
    earnings {
      data {
        grandTotalEarnings {
          riderTotal
        }
        earnings {
          riderEarnings {
            deliveryFee
            tip
            totalEarnings
          }
        }
      }
    }
  }
`;

export const RIDER_TRANSACTIONS_HISTORY = gql`
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

export const RIDER_CURRENT_WITHDRAW_REQUEST = gql`
  query RiderCurrentWithdrawRequest($riderId: String) {
    riderCurrentWithdrawRequest(riderId: $riderId) {
      _id
      requestAmount
      status
      createdAt
    }
  }
`;

export const RIDER_PROFILE = gql`
  query rider($id: String!) {
    rider(id: $id) {
      accountNumber
      assigned
      available
      _id
      zone {
        _id
      }
      bussinessDetails {
        bankName
        accountName
        accountCode
        accountNumber
      }
      createdAt
      currentWalletAmount
      email
      image
      isActive
      vehicleType
      location {
        coordinates
      }
      name
      password
      phone
      totalWalletAmount
      updatedAt
      username
      withdrawnWalletAmount
      location {
        coordinates
      }
      isActive
      licenseDetails {
        expiryDate
        image
        number
      }
      vehicleDetails {
        image
        number
      }
      timeZone
      workSchedule {
        day
        enabled
        slots {
          startTime
          endTime
        }
      }
    }
  }
`;

export const rider = gql`
  query Rider($id: String) {
    rider(id: $id) {
      _id
      location {
        coordinates
      }
    }
  }
`;

export const RIDER_ORDERS = gql`
  query RiderOrders {
    riderOrders {
      _id
      orderId
      createdAt
      acceptedAt
      pickedAt
      assignedAt
      isPickedUp
      deliveredAt
      expectedTime
      deliveryCharges
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
        label
        details
      }
      items {
        _id
        title
        food
        description
        image
        quantity
        variation {
          _id
          title
          price
        }
        addons {
          _id
          options {
            _id
            title
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
        isActive
        createdAt
      }
      user {
        _id
        name
        phone
      }
      chat {
        user
        message
        images
        isActive
      }
      paymentMethod
      paidAmount
      orderAmount
      paymentStatus
      orderStatus
      tipping
      taxationAmount
      reason
      isRiderRinged
      preparationTime
      rider {
        _id
        name
        username
      }
    }
  }
`;
