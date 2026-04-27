import { gql } from "@apollo/client";
export const FETCH_ALL_SHOP_TYPES = gql`
  query FetchAllShopTypes {
    fetchAllShopTypes {
      data {
        _id
        image
        name
        slug
      }
    
    }
  }
`;
