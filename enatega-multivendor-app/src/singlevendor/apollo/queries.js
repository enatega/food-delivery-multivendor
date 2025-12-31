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

export const GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR = gql`
  query GetRestaurantCategoriesSingleVendor {
    getRestaurantCategoriesSingleVendor {
      id
      name
      icon
      image
      description
      itemCount
      viewType
    }
  }
`

export const GET_CATEGORY_ITEMS_SINGLE_VENDOR = gql`
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

// export const GET_FOOD_DETAILS = gql`
//   query GetFoodDetails($foodId: ID!) {
//     getFoodDetails(foodId: $foodId) {
//       id
//       title
//       description
//       image
//       isPopular
//       variations {
//         id
//         title
//         price
//       }
//     }
//   }
// `

export const GET_FOOD_DETAILS = gql`query GetFoodDetails($foodId: ID!) {
    getFoodDetails(foodId: $foodId) {
        id
        title
        description
        image
        isPopular
        variations {
            id
            title
            price
            addons {
                id
                title
                description
                options {
                    id
                    title
                    description
                    price
                }
            }
        }
    }
}`


export const GET_SIMILAR_FOODS = gql`
  query GetSimilarFoods($foodId: ID!, $skip: Int, $limit: Int) {
    getSimilarFoods(foodId: $foodId, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        image
        variations {
          id
          title
          price
        }
      }
      pagination {
        totalItems
        hasMore
      }
    }
  }
`

export const GET_FAVORITE_FOODS_STATUS = gql`
  query GetFavoriteFoodsStatus($foodId: String) {
    getFavoriteFoodsStatus(foodId: $foodId) {
      success
      message
      isFavorite
    }
  }
`
