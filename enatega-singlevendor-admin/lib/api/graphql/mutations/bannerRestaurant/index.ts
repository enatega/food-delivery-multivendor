import { gql } from '@apollo/client';

export const CREATE_BANNER_RESTAURANT = gql`
  mutation CreateBannerRestaurant($bannerInput: BannerRestaurantInput!) {
    createBannerRestaurant(bannerInput: $bannerInput) {
      _id
      title
      description
      file
      foodId
      restaurant
      foodImage
      foodTitle
      displayImage
      isActive
    }
  }
`;

export const EDIT_BANNER_RESTAURANT = gql`
  mutation EditBannerRestaurant($bannerInput: BannerRestaurantInput!) {
    editBannerRestaurant(bannerInput: $bannerInput) {
      _id
      title
      description
      file
      foodId
      restaurant
      foodImage
      foodTitle
      displayImage
      isActive
    }
  }
`;

export const DELETE_BANNER_RESTAURANT = gql`
  mutation DeleteBannerRestaurant($id: String!) {
    deleteBannerRestaurant(id: $id)
  }
`;