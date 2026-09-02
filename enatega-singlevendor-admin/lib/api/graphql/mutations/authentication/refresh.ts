import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!, $userType: String!) {
    refreshToken(refreshToken: $refreshToken, userType: $userType) {
      userId
      token
      tokenExpiration
      refreshToken
      refreshTokenExpiration
    }
  }
`;
