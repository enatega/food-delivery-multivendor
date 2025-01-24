import { gql } from '@apollo/client';

export const UPDATE_WITHDRAW_REQUEST = gql`
  mutation UpdateWithdrawRequest($id: ID!, $status: String!) {
    updateWithdrawReqStatus(id: $id, status: $status) {
      success
      message
      data {
        rider {
          _id
          currentWalletAmount
        }
        withdrawRequest {
          _id
          status
        }
      }
    }
  }
`;
