import { gql } from '@apollo/client';

export const GET_ALL_WITHDRAW_REQUESTS = gql`
  query WithdrawRequests(
    $userType: UserTypeEnum
    $userId: String
    $pageSize: Int!
    $pageNo: Int!
    $search: String
  ) {
    withdrawRequests(
      userType: $userType
      userId: $userId
      pagination: { pageSize: $pageSize, pageNo: $pageNo }
      search: $search
    ) {
      message
      pagination {
        total
      }
      data {
        _id
        requestId
        requestAmount
        requestTime
        status
        createdAt
        rider {
          _id
          name
          email
          phone
          available
          isActive
          # isSuperAdminRider
          accountNumber
          currentWalletAmount
          totalWalletAmount
          withdrawnWalletAmount
          createdAt
          updatedAt
          username
          bussinessDetails {
            bankName
            accountName
            accountCode
            accountNumber
            bussinessRegNo
            companyRegNo
            taxRate
          }
        }
        store {
          unique_restaurant_id
          _id
          image
          logo
          address
          username
          password
          slug
          stripeDetailsSubmitted
          commissionRate
          bussinessDetails {
            bankName
            accountName
            accountCode
            accountNumber
            bussinessRegNo
            companyRegNo
            taxRate
          }
        }
      }
      success
    }
  }
`;
