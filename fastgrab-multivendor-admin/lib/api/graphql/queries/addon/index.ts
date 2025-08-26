import { gql } from '@apollo/client';

export const GET_ADDONS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      addons {
        _id
        title
        description
        quantityMinimum
        quantityMaximum
        options
      }
    }
  }
`;
