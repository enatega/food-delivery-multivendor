import { gql } from '@apollo/client';

export const UPDATE_DELIVERY_OPTIONS = gql`
    mutation UpdateDeliveryOptions($restId: String!, $pickup: Boolean!, $delivery: Boolean!) {
        updateDeliveryOptions(restId: $restId, pickup: $pickup, delivery: $delivery) {
            deliveryOptions {
                delivery
                pickup
            }
        }
    }
`;