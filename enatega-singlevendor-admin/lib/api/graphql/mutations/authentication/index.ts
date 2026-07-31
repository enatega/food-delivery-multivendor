import { gql } from '@apollo/client';

export const OWNER_LOGIN = gql`
  mutation ownerLogin($email: String!, $password: String!) {
    ownerLogin(email: $email, password: $password) {
      userId
      token
      email
      userType
      restaurants {
        _id
        orderId
        name
        image
        address
      }
      permissions
      userTypeId
      image
      name
    }
  }
`;
