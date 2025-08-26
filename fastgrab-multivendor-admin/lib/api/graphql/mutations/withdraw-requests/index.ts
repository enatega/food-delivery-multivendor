import { gql } from '@apollo/client';

export const UPDATE_WITHDRAW_REQUEST = gql`
  mutation UpdateWithdrawRequest($id: ID!, $status: String!) {
    updateWithdrawReqStatus(id: $id, status: $status) {
      # type RiderAndWithdrawRequest {
      #   _id: String
      #   rider: Rider!
      #   withdrawRequest: WithdrawRequest!
      # }
      success
      message
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
    }
  }
`;

export const CREATE_WITHDRAW_REQUEST = gql`
  mutation CreateWithdrawRequest($requestAmount: Float!) {
    createWithdrawRequest(requestAmount: $requestAmount) {
      _id
      requestId
      requestAmount
      requestTime
      status
      createdAt
    }
  }
`;
