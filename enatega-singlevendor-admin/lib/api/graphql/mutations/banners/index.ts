import { gql } from '@apollo/client';

export const CREATE_BANNER = gql`
  mutation CreateBanner($bannerInput: BannerInput!) {
    createBanner(bannerInput: $bannerInput) {
      _id
      title
      description
      action
      file
      screen
      parameters
    }
  }
`;

export const EDIT_BANNER = gql`
  mutation editBanner($bannerInput: BannerInput!) {
    editBanner(bannerInput: $bannerInput) {
      _id
      title
      description
      action
      file
      screen
      parameters
    }
  }
`;

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: String!) {
    deleteBanner(id: $id)
  }
`;
