import { gql } from '@apollo/client';

export const GET_STORE_RIDER = gql`
  query FetchStoresAndRidersL {
    riders {
      _id
      name
    }
    restaurants {
      name
      _id
    }
  }
`;
