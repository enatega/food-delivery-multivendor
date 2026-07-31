import { gql } from '@apollo/client';

export const UPDATE_USER_STATUS = gql`
  mutation updateUserStatus($id: ID!, $status: String!, $reason: String) {
    updateUserStatus(id: $id, status: $status, reason: $reason) {
      _id
      status
    }
  }
`;

export const UPDATE_USER_NOTES = gql`
  mutation updateUserNotes($id: ID!, $notes: String!) {
    updateUserNotes(id: $id, notes: $notes) {
      _id
      notes
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      _id
    }
  }
`;

export const RESET_USER_SESSION = gql`
  mutation resetUserSession($userId: ID!) {
    resetUserSession(userId: $userId) {
      _id
    }
  }
`;
