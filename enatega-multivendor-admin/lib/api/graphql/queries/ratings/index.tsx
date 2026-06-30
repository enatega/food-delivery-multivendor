import { gql } from '@apollo/client';
export const GET_REVIEWS = gql`
  query Reviews($restaurant: String!) {
    reviews(restaurant: $restaurant) {
      _id
      order {
        _id
        orderId
        items {
          title
        }
        user {
          _id
          name
          email
        }
      }
      restaurant {
        _id
        name
        image
      }
      rating
      comments
      description
      createdAt
    }
  }
`;

export const GET_REVIEWS_PAGINATED = gql`
  query RestaurantReviewsPaginated(
    $restaurantId: String!
    $page: Int
    $limit: Int
    $search: String
    $minRating: Float
    $maxRating: Float
  ) {
    restaurantReviewsPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
      minRating: $minRating
      maxRating: $maxRating
    ) {
      data {
        _id
        order {
          _id
          orderId
          items {
            title
          }
          user {
            _id
            name
            email
          }
        }
        restaurant {
          _id
          name
          image
        }
        rating
        comments
        description
        createdAt
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
