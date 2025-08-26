export const cities = `#graphql
query GetCountryByIso($iso: String!) {
  getCountryByIso(iso: $iso) {
    cities {
      id
      name
      latitude
      longitude
    }
  }
}`;
