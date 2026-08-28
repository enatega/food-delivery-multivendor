import { gql } from "@apollo/client";

export const CHAT =
  // @multi-vendor-only
  gql`
    query Chat($order: ID!) {
      chat(order: $order) {
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
  `;

export const SINGLE_VENDOR_CHAT = gql`
  query SingleVendorChat($order: ID!) {
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
