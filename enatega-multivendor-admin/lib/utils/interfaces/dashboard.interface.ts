import { Dispatch, SetStateAction } from 'react';
import { IGlobalComponentProps } from './global.interface';

// Componentns

// Super Admin
export interface IDashboardStatsTableComponentsProps
  extends IGlobalComponentProps {
  amountConfig?: {
    format: 'currency' | 'number';
    currency: string;
  };
  loading: boolean;
  title: string;
  data: { label: string; value: number }[];
}

// Restaurant & Vendor

export interface IDashboardDateFilterComponentsProps {
  dateFilter: IDateFilter;
  setDateFilter: Dispatch<SetStateAction<IDateFilter>>;
  className?: string;
}

export interface IDashboardOrderStatsComponentsProps {
  dateFilter: { startDate: string; endDate: string; dateKeyword?: string };
}

export interface IDashboardGrowthOverviewComponentsProps {
  isStoreView: boolean;
  dateFilter: { startDate: string; endDate: string };
}

export interface IDashboardRestaurantStatesTableComponentsProps {
  dateFilter: { startDate: string; endDate: string };
}

export interface IDashboardRestaurantStatsTableComponentsProps
  extends IGlobalComponentProps {
  amountConfig?: {
    currency: string;
  };
  loading: boolean;
  title: string;
  data: IDashboardRestaurantOrderSalesDetailsByPaymentMethodData;
}

// API

// Super Admin
export interface IDashboardUsersResponseGraphQL {
  getDashboardUsers: {
    usersCount: number;
    vendorsCount: number;
    restaurantsCount: number;
    ridersCount: number;
  };
}

export interface IDashboardUsersByYearResponseGraphQL {
  getDashboardUsersByYear: {
    usersCount: number[];
    vendorsCount: number[];
    restaurantsCount: number[];
    ridersCount: number[];
  };
}

export interface IDashboardOrdersByTypeResponseGraphQL {
  getDashboardOrdersByType: {
    label: string;
    value: number;
  }[];
}

export interface IDashboardSalesByTypeResponseGraphQL {
  getDashboardSalesByType: {
    label: string;
    value: number;
  }[];
}

// Restaurant

export interface IDashboardRestaurantOrdersSalesStatsResponseGraphQL {
  getRestaurantDashboardOrdersSalesStats: {
    totalOrders: number;
    totalSales: number;
    totalCODOrders: number;
    totalCardOrders: number;
  };
}

export interface IDashboardRestaurantSalesOrderCountDetailsByYearResponseGraphQL {
  getRestaurantDashboardSalesOrderCountDetailsByYear: {
    salesAmount: number[];
    ordersCount: number[];
  };
}

interface IDashboardRestaurantOrderSalesDetailsByPaymentMethodData {
  total_orders: number;
  total_sales: number;
  total_sales_without_delivery: number;
  total_delivery_fee: number;
}

interface IDashboardOrderSalesDetailsByPaymentMethodData {
  _type: string;
  data: IDashboardRestaurantOrderSalesDetailsByPaymentMethodData;
}

export interface IDashboardOrderSalesDetailsByPaymentMethodResponseGraphQL {
  getDashboardOrderSalesDetailsByPaymentMethod: {
    all: IDashboardOrderSalesDetailsByPaymentMethodData[];
    cod: IDashboardOrderSalesDetailsByPaymentMethodData[];
    card: IDashboardOrderSalesDetailsByPaymentMethodData[];
  };
}

//  Vendor
export interface IDashboardSubHeaderComponentsProps {
  isStoreView: boolean;
  dateFilter: IDateFilter;
  handleViewChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateFilter: (dateFilter: IDateFilter) => void;
}

export interface IDateFilter {
  dateKeyword?: string;
  startDate: string;
  endDate: string;
}

// Restaurant & Vendor

export interface IDashboardMainComponentProps {
  isStoreView: boolean;
  dateFilter: IDateFilter;
}

export interface IVendorLiveMonitorProps {
  dateFilter: IDateFilter;
}

export interface IDashboardVendorGrowthOverViewTabularComponentsProps {
  dateFilter: IDateFilter;
}

//  Vendor

export interface IVendorStoreDetails {
  _id: string;
  totalOrders: number;
  restaurantName: string;
  totalSales: number;
  pickUpCount: number;
  deliveryCount: number;
}

export interface IVendorLiveMonitor {
  online_stores: number;
  cancelled_orders: number;
  delayed_orders: number;
  ratings: number;
}

export interface IVendorLiveMonitorResponseGraphQL {
  getLiveMonitorData: IVendorLiveMonitor;
}

export interface IVendorStoreDetailsResponseGraphQL {
  getStoreDetailsByVendorId: IVendorStoreDetails[];
}

export interface IVendorDashboardStatsCardDetailsResponseGraphQL {
  getVendorDashboardStatsCardDetails: {
    totalOrders: number;
    totalSales: number;
    totalDeliveries: number;
    totalRestaurants: number;
  };
}

export interface IGetVendorDashboardGrowthDetailsByYearResponseGraphQL {
  getVendorDashboardGrowthDetailsByYear: {
    totalRestaurants: number[];
    totalOrders: number[];
    totalSales: number[];
  };
}
