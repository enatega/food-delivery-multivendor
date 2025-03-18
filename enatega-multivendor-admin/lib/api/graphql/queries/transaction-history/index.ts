import { gql } from '@apollo/client';

export const GET_TRANSACTION_HISTORY = gql`
  query TransactionHistory(
    $userType: UserTypeEnum
    $userId: String
    $search: String
    $pageSize: Int!
    $pageNo: Int!
    $startingDate: String
    $endingDate: String
  ) {
    transactionHistory(
      userType: $userType
      userId: $userId
      search: $search
      pagination: { pageSize: $pageSize, pageNo: $pageNo }
      dateFilter: { starting_date: $startingDate, ending_date: $endingDate }
    ) {
      data {
        _id
        amountCurrency
        status
        transactionId
        userType
        userId
        amountTransferred
        createdAt
        toBank {
          accountName
          bankName
          accountNumber
          accountCode
        }
        rider {
          _id
          name
          email
          username
          password
          phone
          image
          available
          isActive
          # isSuperAdminRider
          accountNumber
          currentWalletAmount
          totalWalletAmount
          withdrawnWalletAmount
          createdAt
          updatedAt
        }
        store {
          unique_restaurant_id
          _id
          name
          rating
          isActive
          isAvailable
          slug
          stripeDetailsSubmitted
          phone
          city
          postCode
        }
      }
      pagination {
        total
      }
    }
  }
`;
