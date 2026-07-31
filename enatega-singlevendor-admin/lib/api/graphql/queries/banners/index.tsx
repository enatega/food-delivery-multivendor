import { gql } from '@apollo/client';

export const GET_BANNERS = gql`
  query Banners {
    banners {
      _id
      title
      description
      action
      screen
      file
      parameters
    }
  }
`;
