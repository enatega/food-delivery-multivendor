import { gql } from '@apollo/client';

export const CREATE_TIPPING = gql`
  mutation CreateTipping($tippingInput: TippingInput!) {
    createTipping(tippingInput: $tippingInput) {
      _id
      tipVariations
      enabled
    }
  }
`;

export const EDIT_TIPPING = gql`
  mutation editTipping($tippingInput: TippingInput!) {
    editTipping(tippingInput: $tippingInput) {
      _id
      tipVariations
      enabled
    }
  }
`;
