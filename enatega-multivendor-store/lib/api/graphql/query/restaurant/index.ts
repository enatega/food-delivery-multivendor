import { gql } from "@apollo/client";

export const GET_RESTAURANT_BY_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      orderId
      orderPrefix
      name
      image
      address
      location {
        coordinates
      }
      deliveryTime
      username
      isAvailable
      notificationToken
      enableNotification
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
