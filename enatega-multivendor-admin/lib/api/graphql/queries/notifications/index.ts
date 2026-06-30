import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      _id
      body
      title
      createdAt
    }
  }
`;

export const GET_NOTIFICATIONS_PAGINATED = gql`
  query NotificationsPaginated($page: Int, $limit: Int, $search: String) {
    notificationsPaginated(page: $page, limit: $limit, search: $search) {
      data {
        _id
        body
        title
        createdAt
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;

export const GET_WEB_NOTIFICATIONS = gql`
  query GetWebNotifications {
    webNotifications {
      _id
      body
      navigateTo
      read
      createdAt
    }
  }
`;
