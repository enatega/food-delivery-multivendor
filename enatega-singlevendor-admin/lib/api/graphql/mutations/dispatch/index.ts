import { gql } from '@apollo/client';

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: String!, $orderStatus: String!) {
    updateStatus(id: $id, orderStatus: $orderStatus) {
      _id
      orderStatus
    }
  }
`;
export const ASSIGN_RIDER = gql`
  mutation AssignRider($id: String!, $riderId: String!) {
    assignRider(id: $id, riderId: $riderId) {
      _id
      orderStatus
      rider {
        _id
        name
      }
    }
  }
`;
