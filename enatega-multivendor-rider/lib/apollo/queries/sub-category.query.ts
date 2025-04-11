export const GET_SUB_CATEGORIES = `#graphql

query subCategories{
  subCategories{
    _id
    title
    parentCategoryId
  }
}
`;
