import { gql } from '@apollo/client';

export const GET_ALL_WITHDRAW_REQUESTS = gql`
  query GetWithdrawRequests($offset: Int) {
    getAllWithdrawRequests(offset: $offset) {
      success
      message
      data {
        _id
        requestId
        requestAmount
        requestTime
        rider {
          _id
          name
          currentWalletAmount
        }
        status
      }
      pagination {
        total
      }
    }
  }
`;
