export const getTaxation = `#graphql
query Taxes{
  taxes {
    _id
    taxationCharges
    enabled
    }
  }`;
