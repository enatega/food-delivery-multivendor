import { gql } from '@apollo/client';

export const CREATE_ADDONS = gql`
  mutation CreateAddons($addonInput: AddonInput) {
    createAddons(addonInput: $addonInput) {
      _id
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
    }
  }
`;
export const EDIT_ADDON = gql`
  mutation editAddon($addonInput: editAddonInput) {
    editAddon(addonInput: $addonInput) {
      _id
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
    }
  }
`;

export const DELETE_ADDON = gql`
  mutation DeleteAddon($id: String!, $restaurant: String!) {
    deleteAddon(id: $id, restaurant: $restaurant) {
      _id
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
    }
  }
`;
