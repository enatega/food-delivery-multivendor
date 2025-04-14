export const versions = `#graphql
query {
    getVersions {
      customerAppVersion
      riderAppVersion
      restaurantAppVersion
    }
  }`;

export const getVersions = `#graphql
  query GetVersions {
    getVersions {
      customerAppVersion {
          android
          ios
      }
    }
  }
  `;
