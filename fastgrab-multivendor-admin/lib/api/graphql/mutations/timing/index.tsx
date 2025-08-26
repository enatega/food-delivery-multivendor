import { gql } from '@apollo/client';

export const UPDATE_TIMINGS = gql`
  mutation UpdateTimings($id: String!, $openingTimes: [TimingsInput]) {
    updateTimings(id: $id, openingTimes: $openingTimes) {
      _id
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`;
