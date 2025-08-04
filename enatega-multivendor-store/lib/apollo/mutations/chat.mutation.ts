import { gql } from "@apollo/client";

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($orderId: ID!, $messageInput: ChatMessageInput!,  $isStoreChat: Boolean) {
    sendChatMessage(message: $messageInput, orderId: $orderId, isStoreChat: $isStoreChat) {
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
