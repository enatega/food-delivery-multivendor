import { gql } from '@apollo/client';

export const GET_BANNER_RESTAURANTS = gql`
  query BannerRestaurants($restaurantId: ID) {
    bannerRestaurants(restaurantId: $restaurantId) {
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

export const GET_BANNER_RESTAURANT = gql`
  query BannerRestaurant($banner: String!, $restaurantId: ID!) {
    bannerRestaurant(banner: $banner, restaurantId: $restaurantId) {
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