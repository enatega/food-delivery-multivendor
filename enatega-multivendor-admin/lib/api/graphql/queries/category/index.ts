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

export const GET_RESTAURANT_CATEGORIES_PAGINATED = gql`
  query RestaurantCategoriesPaginated(
    $restaurantId: String!
    $page: Int
    $limit: Int
    $search: String
  ) {
    restaurantCategoriesPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
    ) {
      data {
        _id
        title
        image
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
