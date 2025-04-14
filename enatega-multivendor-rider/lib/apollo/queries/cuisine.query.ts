export const getCuisines = `#graphql
query Cuisines{
  cuisines {
    _id
    name
    description
    image
    shopType
  }
}`;
