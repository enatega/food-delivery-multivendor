import { gql } from "@apollo/client";

export const UPDATE_WORK_SCHEDULE = gql`
  mutation UpdateTimings(
    $updateTimingsId: String!
    $openingTimes: [TimingsInput]
  ) {
    updateTimings(id: $updateTimingsId, openingTimes: $openingTimes) {
      _id
    }
  }
`;
