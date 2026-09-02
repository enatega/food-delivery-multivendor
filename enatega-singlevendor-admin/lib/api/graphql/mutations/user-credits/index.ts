import { gql } from '@apollo/client';

export const GIVE_USER_CREDITS = gql`
  mutation GiveUserCredits($userId: ID!, $amount: Float!, $orderId: String!, $recordType: CreditRecordType!) {
    giveUserCredits(userId: $userId, amount: $amount, orderId: $orderId, recordType: $recordType) {
      _id
      userId {
        _id
        name
        email
      }
      amount
      orderId
      recordType
      createdAt
      updatedAt
    }
  }
`;

export const EDIT_USER_CREDITS_HISTORY = gql`
  mutation EditUserCreditsHistory($id: ID!, $amount: Float!) {
    editUserCreditsHistory(id: $id, amount: $amount) {
      _id
      userId {
        _id
        name
        email
      }
      amount
      orderId
      recordType
      createdAt
      updatedAt
    }
  }
`;
