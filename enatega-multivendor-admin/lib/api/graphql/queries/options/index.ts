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

export const GET_RESTAURANT_OPTIONS_PAGINATED = gql`
  query RestaurantOptionsPaginated(
    $restaurantId: String!
    $page: Int
    $limit: Int
    $search: String
  ) {
    restaurantOptionsPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
    ) {
      data {
        _id
        title
        description
        price
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
