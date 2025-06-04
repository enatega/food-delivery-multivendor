import { gql } from "@apollo/client";

export const RIDER = gql`
  query Rider($id: String) {
    rider(id: $id) {
      _id
      location {
        coordinates
      }
    }
  }
`;
