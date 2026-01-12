import { useQuery } from '@apollo/client';
import { CALCULATE_CHECKOUT } from '../../apollo/queries';


const useCheckout = ({
  fulfillmentMode,
  deliveryAddress
}) => {
  const isPickup = fulfillmentMode === 'collection';

  console.log('Fulfillment Mode:', fulfillmentMode);
  console.log('deliveryAddress:', deliveryAddress);


  const latDestination = deliveryAddress?.latitude ?? null;
  const longDestination = deliveryAddress?.longitude ?? null;

  const variables = {
    isPickup,
    latDestination,
    longDestination
  };
  console.log('Checkout Variables:', variables)
  
  const { data, loading, error, refetch } = useQuery(
    CALCULATE_CHECKOUT,
    {
      variables,
      fetchPolicy: 'network-only'
    }
  );

  const checkout = data?.calculateCheckout;

  console.log('Checkout Data:', checkout);
  return {
    loading,
    error,
    refetch,

    // Raw
    checkout,

    // UI-friendly derived values
    subtotal: checkout?.subtotal ?? 0,
    deliveryFee: checkout?.deliveryCharges ?? 0,
    serviceFee: checkout?.serviceFee ?? 0,
    minimumOrderFee: checkout?.minimumOrderFee ?? 0,
    taxAmount: checkout?.taxAmount ?? 0,
    totalDiscount: checkout?.totalDiscount ?? 0,
    total: checkout?.grandTotal ?? 0,

    minimumOrderAmount: checkout?.minimumOrderAmount ?? 0,
    isBelowMinimumOrder: checkout?.isBelowMinimumOrder ?? false,
    deliveryDiscount: checkout?.deliveryDiscount ?? 0,
    items: checkout?.items ?? [],

    // deliveryCharges: checkout?.deliveryCharges ?? 0,
    originalDeliveryCharges: checkout?.originalDeliveryCharges ?? 0,
    // deliveryDiscount: checkout?.deliveryDiscount ?? 0,

  };
};

export default useCheckout;
