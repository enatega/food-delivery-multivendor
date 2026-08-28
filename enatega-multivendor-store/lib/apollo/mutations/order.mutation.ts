import { gql } from "@apollo/client";

export const ACCEPT_ORDER = gql`
  mutation AcceptOrder($_id: String!, $time: String) {
    acceptOrder(_id: $_id, time: $time) {
      _id
      orderStatus
      preparationTime
      eta {
        phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($_id: String!, $reason: String!) {
    cancelOrder(_id: $_id, reason: $reason) {
      _id
      orderStatus
      eta {
        phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
      }
    }
  }
`;

export const MUTATE_ORDER_RING = gql`
  mutation muteRing($orderId: String) {
    muteRing(orderId: $orderId)
  }
`;

export const PICK_UP_ORDER = gql`
  mutation OrderPickedUp($_id: String!) {
    orderPickedUp(_id: $_id) {
      _id
      orderStatus
      eta {
        phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
      }
    }
  }
`;
