import { useMutation } from "@apollo/client";
import { GET_ORDERS } from "../apollo/queries/orders";
import { ACCEPT_ORDER } from "../api/graphql";
import { FlashMessageComponent } from "../ui/useable-components";
import { IOrder } from "../utils/interfaces/order.interface";

export default function useAcceptOrder() {
  const [mutateAccept, { loading, error }] = useMutation(ACCEPT_ORDER);
  const acceptOrderFunc = async (_id: string, time: string) => {
    const preparationTime = new Date(
      Date.now() + (parseInt(time, 10) || 0) * 60000,
    ).toISOString();

    try {
      await mutateAccept({
        variables: { _id, time },
        optimisticResponse: {
          acceptOrder: {
            __typename: "Order",
            _id,
            orderStatus: "ACCEPTED",
            preparationTime,
          },
        },
        update: (cache) => {
          const data = cache.readQuery<{ restaurantOrders: IOrder[] }>({
            query: GET_ORDERS,
          });
          if (!data?.restaurantOrders) return;

          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              restaurantOrders: data.restaurantOrders.map((order) =>
                order._id === _id
                  ? {
                      ...order,
                      orderStatus: "ACCEPTED",
                      preparationTime,
                      isRinged: false,
                    }
                  : order,
              ),
            },
          });
        },
      });
    } catch (error) {
      FlashMessageComponent({ message: "Failed to accept order" });
      throw error;
    }
  };

  return { loading, error, acceptOrder: acceptOrderFunc };
}
