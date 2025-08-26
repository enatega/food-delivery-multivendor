import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
        query{
          profile{
            _id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            notificationToken
            isOrderNotification
            isOfferNotification
            addresses{
              _id
              label
              deliveryAddress
              details
              location{coordinates}
              selected
            }
            favourite
          }
        }`;

export const GET_USER_FAVOURITE = gql`
  query UserFavourite($latitude: Float, $longitude: Float) {
    userFavourite(latitude: $latitude, longitude: $longitude) {
      _id
      orderId
      orderPrefix
      name
      isActive
      image
      address
      slug
      shopType
      location {
        coordinates
      }
      deliveryTime
      minimumOrder
      tax
      isAvailable
      reviewCount
      reviewAverage
      reviewData {
        total
        ratings
        reviews {
          _id
          order {
            user {
              _id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories {
        _id
        title
        foods {
          _id
          title
          image
          description
          subCategory
          variations {
            _id
            title
            price
            discounted
            addons
          }
        }
      }
      options {
        _id
        title
        description
        price
      }
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      rating
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`;
