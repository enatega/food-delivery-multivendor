import { gql } from '@apollo/client';

export const SET_VERSIONS = gql`
  mutation SetVersions(
    $customerAppVersion: AppTypeInput
    $riderAppVersion: AppTypeInput
    $restaurantAppVersion: AppTypeInput
  ) {
    setVersions(
      customerAppVersion: $customerAppVersion
      riderAppVersion: $riderAppVersion
      restaurantAppVersion: $restaurantAppVersion
    )
  }
`;
