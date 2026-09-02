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

export const CREATE_FOOD_SINGLE_VENDOR = gql`
  mutation CreateFoodSingleVendor($foodInput: inputCreateFood!) {
    createFoodSingleVendor(foodInput: $foodInput) {
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

export const UPDATE_FOOD_SINGLE_VENDOR = gql`
  mutation UpdateFoodSingleVendor(
    $foodId: ID!
    $foodInput: inputUpdateFood!
  ) {
    updateFoodSingleVendor(foodId: $foodId, foodInput: $foodInput) {
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
