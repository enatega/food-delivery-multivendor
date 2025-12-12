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

export const GET_ALL_FOODS = gql`
  query GetAllfoods($restaurantId: String!) {
    getAllfoods(restaurantId: $restaurantId) {
      id
      title
      image
      variations {
        id
        title
        price
        outofstock
      }
    }
  }
`;

export const GET_ALL_FOOD_DEALS_ADMIN = gql`
  query GetAllFoodDealsAdmin(
    $page: Int!
    $limit: Int!
    $isActive: Boolean
    $search: String
    $restaurantId: ID!
  ) {
    getAllFoodDealsAdmin(
      page: $page
      limit: $limit
      isActive: $isActive
      search: $search
      restaurantId: $restaurantId
    ) {
      total
      page
      limit
      deals {
        id
        title
        discountType
        food
        variation
        restaurant
        startDate
        endDate
        discountValue
        isActive
        createdAt
        updatedAt
        foodTitle
        variationTitle
      }
    }
  }
`;
