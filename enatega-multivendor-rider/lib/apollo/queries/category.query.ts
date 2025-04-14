export const GET_SUB_CATEGORIES_BY_PARENT_ID = `#graphql

query subCategoriesByParentId($parentCategoryId:String!){
  subCategoriesByParentId(parentCategoryId:$parentCategoryId){
    _id
    title
    parentCategoryId
  }
}
`;
