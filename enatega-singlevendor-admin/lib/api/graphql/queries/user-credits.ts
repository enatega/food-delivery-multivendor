import { gql } from '@apollo/client';

export const GET_ALL_CREDITS_RECORDS = gql`
  query GetAllCreditsRecords($searchTerm: String) {
    getAllCreditsRecords(searchTerm: $searchTerm) {
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

export const GET_ALL_USERS_DROPDOWN_SEARCH = gql`
  query GetAllUsersDropDownSearch($searchTerm: String) {
    getAllUsersDropDownSearch(searchTerm: $searchTerm) {
      _id
      name
      email
    }
  }
`;
