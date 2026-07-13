import { gql } from '@apollo/client';

export const CREATE_RIDER = gql`
  mutation CreateRider($riderInput: RiderInput!) {
    createRider(riderInput: $riderInput) {
      _id
      name
      username
      password
      phone
      available
      vehicleType
      zone {
        _id
      }
    }
  }
`;

export const EDIT_RIDER = gql`
  mutation EditRider($riderInput: RiderInput!) {
    editRider(riderInput: $riderInput) {
      _id
      name
      username
      phone
      password
      vehicleType
      zone {
        _id
      }
    }
  }
`;

export const DELETE_RIDER = gql`
  mutation DeleteRider($id: String!) {
    deleteRider(id: $id) {
      _id
    }
  }
`;

export const TOGGLE_RIDER = gql`
  mutation ToggleRider($id: String!) {
    toggleAvailablity(id: $id) {
      _id
      name
      username
      phone
      available
      vehicleType
      zone {
        title
      }
    }
  }
`;
