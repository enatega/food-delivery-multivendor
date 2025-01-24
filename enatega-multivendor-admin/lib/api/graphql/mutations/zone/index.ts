import { gql } from '@apollo/client';

export const CREATE_ZONE = gql`
  mutation CreateZone($zone: ZoneInput!) {
    createZone(zone: $zone) {
      _id
      title
      description
      location {
        coordinates
      }
      isActive
    }
  }
`;

export const EDIT_ZONE = gql`
  mutation EditZone($zone: ZoneInput!) {
    editZone(zone: $zone) {
      _id
      title
      description
      location {
        coordinates
      }
      isActive
    }
  }
`;

export const DELETE_ZONE = gql`
  mutation DeleteZone($id: String!) {
    deleteZone(id: $id) {
      _id
      title
      description
      location {
        coordinates
      }
      isActive
    }
  }
`;
