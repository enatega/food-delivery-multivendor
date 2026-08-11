import { gql } from "@apollo/client";

export const SEND_CHAT_MESSAGE =
  // @multi-vendor-only
  gql`
    mutation SendChatMessage($orderId: ID!, $messageInput: ChatMessageInput!) {
      sendChatMessage(message: $messageInput, orderId: $orderId) {
        success
        message
        data {
          id
          message
          image
          user {
            id
            name
          }
          createdAt
        }
      }
    }
  `;

export const SINGLE_VENDOR_SEND_CHAT_MESSAGE = gql`
  mutation SingleVendorSendChatMessage(
    $orderId: ID!
    $messageInput: ChatMessageInput!
  ) {
    sendChatMessage(message: $messageInput, orderId: $orderId) {
      success
      message
      data {
        id
        message
        user {
          id
          name
        }
        createdAt
      }
    }
  }
`;
