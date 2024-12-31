import { IExtendedOrder } from "../interfaces"
import { ReactElement } from "react";
export type TOrderRowData =
| IExtendedOrder
| {
    orderId: ReactElement,
    itemsTitle: ReactElement,
    paymentMethod: ReactElement,
    orderStatus: ReactElement,
    DateCreated: ReactElement,
    OrderdeliveryAddress: ReactElement,
  };