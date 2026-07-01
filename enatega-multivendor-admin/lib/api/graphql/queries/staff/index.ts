import { gql } from '@apollo/client';

export const GET_STAFFS = gql`
  query staffs {
    staffs {
      _id
      name
      email
      phone
      # vehicleType
      isActive
      permissions
    }
  }
`;

export const GET_STAFFS_PAGINATED = gql`
  query StaffsPaginated(
    $page: Int
    $limit: Int
    $search: String
    $isActive: Boolean
  ) {
    staffsPaginated(
      page: $page
      limit: $limit
      search: $search
      isActive: $isActive
    ) {
      data {
        _id
        name
        email
        phone
        isActive
        permissions
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
