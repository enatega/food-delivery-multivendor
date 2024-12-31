import { gql } from '@apollo/client';

export const SEND_NOTIFICATION_USER = gql`
  mutation SendNotificationUser(
    $notificationTitle: String
    $notificationBody: String!
  ) {
    sendNotificationUser(
      notificationTitle: $notificationTitle
      notificationBody: $notificationBody
    )
  }
`;
