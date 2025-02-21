import { IGlobalComponentProps } from '../global.interface';
import { ReactNode } from 'react';

export interface IOrderVendorHeaderProps extends IGlobalComponentProps {
  setSelectedActions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedActions: string[];
  onSearch: (searchTerm: string) => void;
}

export interface IMenuItem extends IGlobalComponentProps {
  label: string;
  value: string;
}

export interface Items {
  variation: {
    price: number;
  };
  addons?: Array<{
    options: Array<{
      price: number;
      title: string;
    }>;
  }>;
  description: ReactNode;
  title: string;
  quantity: number;
}

export interface IOrder extends IGlobalComponentProps {
  _id: string;
  orderId: string;
  items: Items[];
  paymentStatus: string;
  createdAt: string;
  deliveryAddress: {
    deliveryCharges: ReactNode;
    deliveryAddress: string;
  };
  orderAmount: number;
  orderStatus: string;
}

// Create a new interface that extends IOrder with the additional properties
export interface IExtendedOrder extends IOrder {
  paidAmount?: number;
  paymentMethod?: ReactNode;
  deliveryCharges?: number;
  tipping?: number;
  reason?: string | null;
  taxationAmount?: number;
  itemsTitle?: string;
  OrderdeliveryAddress?: string;
  DateCreated?: string;
}

export interface IOrdersData extends IGlobalComponentProps {
  ordersByRestId: IOrder[];
  ordersByRestIdWithoutPagination: IOrder[];
}

export interface ITableOrder extends IOrder {
  itemsTitle: string;
  OrderdeliveryAddress: string;
  DateCreated: string;
}
