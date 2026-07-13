import { gql } from '@apollo/client';

export const CREATE_SUBSCRIPTION_PLAN = gql`
  mutation CreatePriceForProduct($input: CreatePriceInput!) {
    createPriceForProduct(input: $input) {
      success
      message
      price {
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

export const DEACTIVATE_SUBSCRIPTION_PLAN = gql`
  mutation DeactivatePrice($input: DeactivatePriceInput!) {
    deactivatePrice(input: $input) {
      success
      message
    }
  }
`;
