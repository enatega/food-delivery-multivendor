import { gql } from '@apollo/client';

export const GET_CATEGORY_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id

      categories {
        _id
        title
        image
      }
    }
  }
`;