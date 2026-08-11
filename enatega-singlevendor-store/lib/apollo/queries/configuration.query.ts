import { gql } from "@apollo/client";

export const GET_CONFIGURATION = gql`
  query Configuration {
    configuration {
      _id
      currency
      currencySymbol
      restaurantAppSentryUrl
    }
  }
`;
