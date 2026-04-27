export const getZones = `#graphql
query Zones{
  zones{
  _id
  title
  description
  location{coordinates}
  isActive
  }
}`;
