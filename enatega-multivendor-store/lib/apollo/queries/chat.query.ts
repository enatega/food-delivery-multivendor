import { gql } from "@apollo/client";

export const CHAT = gql`
  query Chat($order: ID!) {
    chat(order: $order) {
      id
      message
      user {
        id
        name
      }
      createdAt
    }
  }
`;


export const GET_STORE_CHAT_MESSAGES = gql`
  query GetStoreChatMessages($order: ID!) {
    storeChat(order: $order) {
      id
      message
      user {
        id
        name
      }
      createdAt
    }
  }`