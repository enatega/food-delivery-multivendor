import { gql } from '@apollo/client';

export const GET_OPTIONS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      options {
        _id
        title
        description
        price
      }
    }
  }
`;
