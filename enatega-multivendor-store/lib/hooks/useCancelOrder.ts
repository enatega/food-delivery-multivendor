import { useMutation } from "@apollo/client";
import { CANCEL_ORDER } from "../api/graphql";
import { FlashMessageComponent } from "../ui/useable-components";

export default function useCancelOrder() {
  const [mutateCancel, { loading, error }] = useMutation(CANCEL_ORDER);
  const cancelOrderFunc = async (_id: string, reason: string) => {
    try {
      await mutateCancel({ variables: { _id, reason } });
    } catch {
      FlashMessageComponent({ message: "Failed to cancel order" });
    }
  };
  return { loading, error, cancelOrder: cancelOrderFunc };
}
