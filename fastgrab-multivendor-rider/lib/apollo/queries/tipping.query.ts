export const getTipping = `#graphql
query Tips{
    tips {
      _id
      tipVariations
      enabled
    }
  }`;
