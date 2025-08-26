import { IGlobalComponentProps } from "./global.interface";

export interface ISetOrderTimeComponentProps extends IGlobalComponentProps {
  id: string;
  orderId: string;
  handleDismissModal: () => void;
}
