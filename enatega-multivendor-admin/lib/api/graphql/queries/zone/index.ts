import { gql } from '@apollo/client';

export const GET_ZONES = gql`
  query Zones {
    zones {
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
