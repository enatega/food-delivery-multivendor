import { gql } from '@apollo/client';

export const GET_ZONES = gql`
  query Zones {
    zones {
      _id
      title
      description
      location {
        coordinates
      }
      isActive
    }
  }
`;

export const GET_ZONES_PAGINATED = gql`
  query ZonesPaginated(
    $page: Int
    $limit: Int
    $search: String
    $isActive: Boolean
  ) {
    zonesPaginated(
      page: $page
      limit: $limit
      search: $search
      isActive: $isActive
    ) {
      data {
        _id
        title
        description
        location {
          coordinates
        }
        isActive
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;
