import { gql } from '@apollo/client';

export const GET_VENDORS = gql`
  query vendors {
    vendors {
      unique_id
      _id
      email
      userType
      isActive
      name
      image
      restaurants {
        _id
      }
    }
    vendorCount @client
  }
`;

export const GET_VENDORS_L = gql`
  query vendors {
    vendors {
      _id
    }
  }
`;

export const GET_VENDOR_BY_ID = gql`
  query GetVendor($id: String!) {
    getVendor(id: $id) {
      _id
      email
      userType
      name
      plainPassword
      image
      firstName
      lastName
      phoneNumber
    }
  }
`;

export const GET_VENDOR_BY_ID_WITH_RESTAURANTS = gql`
  query GetVendor($id: String!) {
    getVendor(id: $id) {
      _id
      email
      userType
      name
      plainPassword
      image
      restaurants {
        _id
        orderId
        orderPrefix
        slug
        name
        image
        address
        location {
          coordinates
        }
        shopType
      }
    }
  }
`;
