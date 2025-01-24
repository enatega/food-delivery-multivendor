import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      title
      body
      createdAt
    }
  }
`;
