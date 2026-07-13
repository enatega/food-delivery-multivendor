import { gql } from '@apollo/client';

export const CREATE_FOOD_DEAL = gql`
  mutation CreateFoodDeal($input: CreateDealInput!) {
    createFoodDeal(input: $input) {
      id
      title
      discountType
      food
      startDate
      endDate
      discountValue
      isActive
      createdAt
      updatedAt
      variation
    }
  }
`;

export const UPDATE_FOOD_DEAL = gql`
  mutation UpdateFoodDeal($id: ID!, $input: UpdateDealInput!) {
    updateFoodDeal(id: $id, input: $input) {
      id
      title
      discountType
      food
      variation
      startDate
      endDate
      discountValue
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FOOD_DEAL = gql`
  mutation DeleteFoodDeal($id: ID!) {
    deleteFoodDeal(id: $id) {
      message
    }
  }
`;
