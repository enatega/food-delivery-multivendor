import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      _id
      name
      email
      phone
      createdAt
      addresses {
        location {
          coordinates
        }
        deliveryAddress
      }
    }
  }
`;
export const GET_USERS_L = gql`
  query users {
    users {
      _id
    }
  }
`;
