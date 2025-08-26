import { gql } from "@apollo/client";

export const CREATE_WITHDRAW_REQUEST = gql`
  mutation Mutation($requestAmount: Float!) {
    createWithdrawRequest(requestAmount: $requestAmount) {
      status
    }
  }
`;
