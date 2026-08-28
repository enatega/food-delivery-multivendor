import { gql } from '@apollo/client';

export const CREATE_OPTIONS = gql`
  mutation CreateOptions($optionInput: CreateOptionInput) {
    createOptions(optionInput: $optionInput) {
      _id
      options {
        _id
        title
        description
        price
      }
    }
  }
`;

export const DELETE_OPTION = gql`
  mutation DeleteOption($id: String!, $restaurant: String!) {
    deleteOption(id: $id, restaurant: $restaurant) {
      _id
      options {
        _id
        title
        description
        price
      }
    }
  }
`;

export const EDIT_OPTION = gql`
  mutation EditOption($optionInput: editOptionInput) {
    editOption(optionInput: $optionInput) {
      _id
      options {
        _id
        title
        description
        price
      }
    }
  }
`;
