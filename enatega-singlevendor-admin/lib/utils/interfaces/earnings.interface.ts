export interface IEarningTableHeaderProps {
  onClearFilters: () => void; 
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateFilters: {
    startingDate: string;
    endingDate: string;
    userType?: UserTypeEnum;
    userId?: string;
    orderType?: OrderTypeEnum;
    paymentMethod?: PaymentMethodEnum;
  };

  setDateFilters: React.Dispatch<
    React.SetStateAction<{
      startingDate: string;
      endingDate: string;
      userType?: UserTypeEnum;
      userId?: string;
      orderType?: OrderTypeEnum;
      paymentMethod?: PaymentMethodEnum;
    }>
  >;
  
}

export interface IEarningsRestaurantHeaderComponentProps {
  earnings: Omit<IStoreEarnings, ' platformTotal' | 'riderTotal'>;
}
export interface IEarningsRestaurantMainComponentProps {
  setTotalEarnings: React.Dispatch<React.SetStateAction<IStoreEarnings>>;
}

export interface IEarningsHeaderComponentProps {
  earnings: IGrandTotalEarnings;
}
export interface IEarningsMainComponentProps {
  setTotalEarnings: React.Dispatch<React.SetStateAction<IGrandTotalEarnings>>;
}

export interface IStoreEarnings
  extends Omit<IGrandTotalEarnings, ' platformTotal' | 'riderTotal'> {}

export enum UserTypeEnum {
  ALL = 'ALL',
  RIDER = 'RIDER',
  STORE = 'STORE',
}

export enum OrderTypeEnum {
  ALL = 'ALL',
  RIDER = 'DELIVERY',
  STORE = 'PICKUP',
}

export enum PaymentMethodEnum {
  ALL = 'ALL',
  COD = 'COD',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
}

export interface IEarning {
  _id: string;
  orderId: string;
  orderType: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  platformEarnings: {
    marketplaceCommission: number;
    deliveryCommission: number;
    tax: number;
    platformFee: number;
    totalEarnings: number;
  };
  riderEarnings: {
    riderId: {
      _id: string;
      name: string;
      username: string;
    };
    deliveryFee: number;
    tip: number;
    totalEarnings: number;
  };
  storeEarnings: {
    storeId: {
      _id: string;
      name: string;
      username: string;
    };
    orderAmount: number;
    totalEarnings: number;
  };
}

export interface IGrandTotalEarnings {
  platformTotal: number;
  riderTotal: number;
  storeTotal: number;
}

export interface IEarningsResponse {
  success: boolean;
  message: string;
  data: {
    earnings: IEarning[];
    grandTotalEarnings: IGrandTotalEarnings;
  };
  pagination: {
    total: number;
  };
}

export interface IEarningFilters {
  startingDate: string;
  endingDate: string;
  userType?: UserTypeEnum;
  orderType?: OrderTypeEnum;
  paymentMethod?: PaymentMethodEnum;
  userId?: string;
}

export interface IEarningVariables {
  pageSize: number;
  pageNo: number;
  startingDate?: string;
  endingDate?: string;
  userType?: UserTypeEnum;
  userId?: string;
  orderType?: OrderTypeEnum;
  paymentMethod?: PaymentMethodEnum;
}
