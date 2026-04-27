import { gql } from '@apollo/client';

export const CREATE_FOOD = gql`
  mutation CreateFood($foodInput: FoodInput!) {
    createFood(foodInput: $foodInput) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
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
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const EDIT_FOOD = gql`
  mutation EditFood($foodInput: FoodInput!) {
    editFood(foodInput: $foodInput) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
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
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_FOOD = gql`
  mutation DeleteFood(
    $id: String!
    $restaurant: String!
    $categoryId: String!
  ) {
    deleteFood(id: $id, restaurant: $restaurant, categoryId: $categoryId) {
      _id
    }
  }
`;
