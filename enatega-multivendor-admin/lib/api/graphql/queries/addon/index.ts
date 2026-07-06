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

export const GET_RESTAURANT_ADDONS_PAGINATED = gql`
  query RestaurantAddonsPaginated(
    $restaurantId: String!
    $page: Int
    $limit: Int
    $search: String
  ) {
    restaurantAddonsPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
    ) {
      data {
        _id
        title
        description
        quantityMinimum
        quantityMaximum
        options
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
