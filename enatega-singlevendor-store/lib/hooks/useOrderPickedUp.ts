import { useMutation } from "@apollo/client";
import { PICK_UP_ORDER } from "../apollo/mutations/order.mutation";

export default function useOrderPickedUp() {
  const [mutatePickedUp, { loading, error }] = useMutation(PICK_UP_ORDER);
  const pickedUpOrderFunc = (_id: string) => {
    mutatePickedUp({ variables: { _id } });
  };

  return { loading, error, pickedUp: pickedUpOrderFunc };
}
