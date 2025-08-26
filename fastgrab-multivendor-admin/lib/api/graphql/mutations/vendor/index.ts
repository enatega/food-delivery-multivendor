import { gql } from '@apollo/client';

export const CREATE_VENDOR = gql`
  mutation CreateVendor($vendorInput: VendorInput) {
    createVendor(vendorInput: $vendorInput) {
      _id
      email
      password
      name
      image
      firstName
      lastName
      phoneNumber
    }
  }
`;

export const EDIT_VENDOR = gql`
  mutation EditVendor($vendorInput: VendorInput) {
    editVendor(vendorInput: $vendorInput) {
      _id
      email
      password
      name
      image
      firstName
      lastName
      phoneNumber
    }
  }
`;

export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: String!) {
    deleteVendor(id: $id)
  }
`;
