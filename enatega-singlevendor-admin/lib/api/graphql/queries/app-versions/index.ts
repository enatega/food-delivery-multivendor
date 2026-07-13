import { gql } from '@apollo/client';

export const GET_VERSIONS = gql`
query GetVersions {
  getVersions {
    customerAppVersion {
        android
        ios
    }
    riderAppVersion {
        android
        ios
    }
    restaurantAppVersion {
        android
        ios
    }
  }
}
`;