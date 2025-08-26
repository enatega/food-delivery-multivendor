import { gql } from "@apollo/client";

export const SELECT_ADDRESS = gql`
  mutation SelectAddress($id: String!) {
    selectAddress(id: $id) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($addressInput: AddressInput!) {
    createAddress(addressInput: $addressInput) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`;

export const EDIT_ADDRESS = gql`
  mutation EditAddress($addressInput: AddressInput!) {
    editAddress(addressInput: $addressInput) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      _id
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
      }
    }
  }
`;
