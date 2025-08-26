import gql from "graphql-tag";

export const GET_CONFIGURATION = gql`
  query Configuration {
    configuration {
      _id
      currency
      currencySymbol
      riderAppSentryUrl
      googleApiKey
    }
  }
`;
