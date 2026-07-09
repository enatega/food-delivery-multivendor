import { useMutation } from "@apollo/client";
import { GET_ORDERS } from "../apollo/queries/orders";
import { MUTATE_ORDER_RING } from "../api/graphql";
import { IOrder } from "../utils/interfaces/order.interface";

export default function useOrderRing() {
  const [mutate, { loading }] = useMutation(MUTATE_ORDER_RING, {
    refetchQueries: [{ query: GET_ORDERS }],
    awaitRefetchQueries: true,
  });
  const muteRing = async (id: string) => {
    await mutate({
      variables: { orderId: id },
      optimisticResponse: { muteRing: true },
      update: (cache) => {
        const data = cache.readQuery<{ restaurantOrders: IOrder[] }>({
          query: GET_ORDERS,
        });
        if (!data?.restaurantOrders) return;

        cache.writeQuery({
          query: GET_ORDERS,
          data: {
            restaurantOrders: data.restaurantOrders.map((order) =>
              order.orderId === id ? { ...order, isRinged: false } : order,
            ),
          },
        });
      },
    });
  };
  return { loading, muteRing };
}
