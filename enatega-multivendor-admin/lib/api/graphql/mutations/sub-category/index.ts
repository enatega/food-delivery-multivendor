import { gql } from '@apollo/client';

export const CREATE_SUB_CATEGORIES = gql`
  mutation createSubCategories($subCategories: [SubCategoryInput!]!) {
    createSubCategories(subCategories: $subCategories)
  }
`;

export const DELETE_SUB_CATEGORY = gql`
  mutation deleteSubCtg($deleteSubCategoryId2: String!) {
    deleteSubCategory(_id: $deleteSubCategoryId2)
  }
`;
