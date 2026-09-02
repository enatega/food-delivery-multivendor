import { gql } from '@apollo/client';
export const updateCommission = gql`
  mutation UpdateCommission($id: String!, $commissionRate: Float!) {
    updateCommission(id: $id, commissionRate: $commissionRate) {
      _id
      commissionRate
    }
  }
`;
