import { gql } from '@apollo/client';

export const OWNER_SESSION = gql`
  query OwnerSession {
    ownerSession {
      userId
      email
      userType
      userTypeId
      permissions
      name
      image
      restaurants {
        _id
        name
      }
      token
      tokenExpiration
      refreshToken
      refreshTokenExpiration
      isActive
    }
  }
`;

export const HAS_OWNER_PERMISSION = gql`
  query HasOwnerPermission($permission: String!) {
    hasOwnerPermission(permission: $permission)
  }
`;
