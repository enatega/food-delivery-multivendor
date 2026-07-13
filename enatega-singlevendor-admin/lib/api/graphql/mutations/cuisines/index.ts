import { gql } from '@apollo/client';

export const CREATE_CUISINE = gql`
  mutation CreateCuisine($cuisineInput: CuisineInput!) {
    createCuisine(cuisineInput: $cuisineInput) {
      _id
      name
      description
      image
      shopType
    }
  }
`;
export const EDIT_CUISINE = gql`
  mutation editCuisine($cuisineInput: CuisineInput!) {
    editCuisine(cuisineInput: $cuisineInput) {
      _id
      name
      description
      image
      shopType
    }
  }
`;
export const DELETE_CUISINE = gql`
  mutation DeleteCuisine($id: String!) {
    deleteCuisine(id: $id)
  }
`;
