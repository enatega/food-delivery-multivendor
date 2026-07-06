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

export const GET_CUISINES_PAGINATED = gql`
  query CuisinesPaginated(
    $page: Int
    $limit: Int
    $search: String
    $shopType: String
  ) {
    cuisinesPaginated(
      page: $page
      limit: $limit
      search: $search
      shopType: $shopType
    ) {
      data {
        _id
        name
        description
        image
        shopType
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
