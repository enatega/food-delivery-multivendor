import { gql } from '@apollo/client';

export const GET_FOODS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
          isOutOfStock
          subCategory
          variations {
            _id
            title
            price
            discounted
            addons
            isOutOfStock
          }
          image
          isActive
          subCategory
        }
      }
    }
  }
`;
