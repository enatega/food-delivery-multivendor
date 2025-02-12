import { gql } from '@apollo/client';

export const GET_RIDERS = gql`
  query riders {
    riders {
      _id
      name
      username
      password
      phone
      available
      vehicleType
      assigned
      zone {
        _id
        title
      }
    }
  }
`;

export const GET_RIDERS_L = gql`
  query riders {
    riders {
      _id
    }
  }
`;

export const GET_AVAILABLE_RIDERS = gql`
  query {
    availableRiders {
      _id
      name
      username
      phone
      available
      vehicleType
      zone {
        _id
      }
    }
  }
`;
export const GET_RIDERS_BY_ZONE = gql`
  query RidersByZone($id: String!) {
    ridersByZone(id: $id) {
      _id
      name
      username
      phone
      available
      vehicleType
      zone {
        _id
        title
      }
    }
  }
`;
