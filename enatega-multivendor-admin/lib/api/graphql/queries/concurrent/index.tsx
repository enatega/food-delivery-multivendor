import { gql } from "@apollo/client";

export const GET_STORE_RIDER = gql`
 query FetchStoresAndRidersL($isSuperAdminRider: Boolean) {
    riders(isSuperAdminRider: $isSuperAdminRider) {
      _id
      name
    }
    restaurants {
      name
      _id
    }
  }

`