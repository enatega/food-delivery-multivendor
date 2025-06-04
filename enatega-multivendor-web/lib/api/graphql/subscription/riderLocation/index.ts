import { gql } from "@apollo/client";

export const SUBSCRIPTION_RIDER_LOCATION = gql`
  subscription SubscriptionRiderLocation($riderId: String!) {
    subscriptionRiderLocation(riderId: $riderId) {
      _id
      location {
        coordinates
      }
    }
  }
`;