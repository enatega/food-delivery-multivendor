import gql from 'graphql-tag'

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

export const Get_Restaurant_Categories_Single_Vendor = gql`
  query GetRestaurantCategoriesSingleVendor {
    getRestaurantCategoriesSingleVendor {
      id
      name
      icon
      image
      description
      itemCount
    }
  }
`

export const Get_Category_Items_Single_Vendor = gql`
  query GetCategoryItemsSingleVendor($categoryId: ID!, $skip: Int, $limit: Int, $search: String) {
    getCategoryItemsSingleVendor(categoryId: $categoryId, skip: $skip, limit: $limit, search: $search) {
      categoryId
      categoryName
      items {
        id
        title
        description
        image
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
      }
      pagination {
        currentPage
        totalItems
        hasMore
        totalPages
      }
    }
  }
`
