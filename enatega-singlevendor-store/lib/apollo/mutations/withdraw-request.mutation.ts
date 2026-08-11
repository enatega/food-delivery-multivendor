import { gql } from "@apollo/client";

export const CREATE_WITHDRAW_REQUEST = gql`
  mutation Mutation($requestAmount: Float!, $userId: String!) {
    createWithdrawRequest(requestAmount: $requestAmount, userId: $userId) {
      status
    }
  }
`;
