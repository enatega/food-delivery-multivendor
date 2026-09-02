import { gql } from '@apollo/client';

export const GET_TIPPING = gql`
  query Tips {
    tips {
      _id
      tipVariations
      enabled
    }
  }
`;
