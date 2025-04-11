import { IGlobalComponentProps } from "./global.interface";

export interface IWellDoneComponentProps extends IGlobalComponentProps {
  status?: string;
  orderId: string;
  setOrderId: (id: string) => void;
}
