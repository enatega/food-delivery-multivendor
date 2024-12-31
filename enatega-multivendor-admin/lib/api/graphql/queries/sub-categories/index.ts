import { gql } from '@apollo/client';

export const GET_SUBCATEGORIES = gql`
  query subCategories {
    subCategories {
      _id
      title
      parentCategoryId
    }
  }
`;
export const GET_SUBCATEGORY = gql`
query SubCategory($id: String) {
  subCategory(_id: $id) {
    _id
    title
    parentCategoryId
  }
}
`;
export const GET_SUBCATEGORIES_BY_PARENT_ID = gql`
  query GetSubCategoriesByParentId($parentCategoryId: String!) {
    subCategoriesByParentId(parentCategoryId: $parentCategoryId) {
      _id
      title
      parentCategoryId
    }
  }
`;
