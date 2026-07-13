import { gql } from '@apollo/client';

export const GET_SHOP_TYPES = gql`
 query FetchShopTypes($filter: FetchShopTypeFilter, $pagination: PaginationInput) {
  fetchShopTypes(filter: $filter, pagination: $pagination) {
    data {
      _id
      name
      image
      isActive
    }
    total
    page
    pageSize
    totalPages
    hasNextPage
    hasPrevPage
  }
}`;

export const GET_UNIQUE_SHOP_TYPE = gql`
 query FetchUniqueShopType($dto: FetchUniqueShopTypeInput) {
  fetchShopTypeByUnique(dto: $dto) {
      _id
      name
      image
      isActive
  }
}`;
