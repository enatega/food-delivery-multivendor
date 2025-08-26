import { gql } from '@apollo/client';

export const GET_CUISINES = gql`
  query Cuisines {
    cuisines {
      _id
      name
      description
      image
      shopType
    }
  }
`;
