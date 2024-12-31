import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($category: CategoryInput!) {
    createCategory(category: $category) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
          variations {
            _id
            title
            price
            discounted
            addons
          }
          image
          isActive
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const EDIT_CATEGORY = gql`
  mutation EditCategory($category: CategoryInput!) {
    editCategory(category: $category) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
          variations {
            _id
            title
            price
            discounted
            addons
          }
          image
          isActive
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!, $restaurant: String!) {
    deleteCategory(id: $id, restaurant: $restaurant) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
          variations {
            _id
            title
            price
            discounted
            addons
          }
          image
          isActive
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;