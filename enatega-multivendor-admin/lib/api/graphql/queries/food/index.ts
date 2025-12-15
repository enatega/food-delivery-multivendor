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

export const GET_ALL_FOODS_PAGINATED = gql`
  query GetAllFoodsPaginated($restaurantId: ID!, $page: Int, $limit: Int, $search: String) {
    getAllfoodsPaginated(
      restaurantId: $restaurantId
      page: $page
      limit: $limit
      search: $search
    ) {
      page
      limit
      hasnext
      hasprev
      totalFoods
      foods {
        category {
          id
          title
        }
        food {
          id
          title
          subCategory
          image
          isActive
          UOM
          inventory
          isOutOfStock
          orderQuantity {
            min
            max
          }
          variations {
            id
            title
            price
            outofstock
            deal {
              id
              name
              type
              value
              startDate
              endDate
              isActive
            }
            addons {
              title
              description
              isActive
            }
          }
        }
      }
    }
  }
`;
