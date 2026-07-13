import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      _id
      name
      email
      phone
      createdAt
      userType
      status
      lastLogin
      notes
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

export const GET_USER_BY_ID = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      isActive
      status
      lastLogin
      isOrderNotification
      isOfferNotification
      createdAt
      updatedAt
      notificationToken
      userType
      favourite
      notes
      addresses {
        _id
        deliveryAddress
        details
        label
        selected
        location {
          coordinates
        }
      }
    }
  }
`;
