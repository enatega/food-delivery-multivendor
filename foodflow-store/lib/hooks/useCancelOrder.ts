import { useMutation } from "@apollo/client";
import { CANCEL_ORDER } from "../api/graphql";

export default function useCancelOrder() {
  const [mutateCancel, { loading, error }] = useMutation(CANCEL_ORDER);
  const cancelOrderFunc = (_id: string, reason: string) => {
    mutateCancel({ variables: { _id, reason } });
  };
  return { loading, error, cancelOrder: cancelOrderFunc };
}
