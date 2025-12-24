import gql from "graphql-tag";

export const GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA = gql`
  query GetAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
    getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
        categoryId
        categoryName
        items {
            id
            title
            image
            description
            variations {
                id
                title
                price
                deal {
                    id
                    discountType
                    discountValue
                    isActive
                }
            }
            subCategory
        }
        subCategories {
            subCategoryId
            subCategoryName
            items {
                id
                title
                image
                description
                variations {
                    id
                    title
                    price
                    deal {
                        id
                        discountType
                        discountValue
                        isActive
                    }
                }
                subCategory
            }
        }
    }
}
`