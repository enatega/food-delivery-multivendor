import { gql } from '@apollo/client';

export const GET_ALL_SUBSCRIPTION_PLANS = gql`
  query GetAllSubscriptionPlans {
    getAllSubscriptionPlans {
      plans {
        id
        amount
        interval
        intervalCount
        productName
        productId
      }
    }
  }
`;
