import { gql } from '@apollo/client';

// Super Admin
export const GET_DASHBOARD_USERS = gql`
  query GetDashboardUsers {
    getDashboardUsers {
      usersCount
      vendorsCount
      restaurantsCount
      ridersCount
    }
  }
`;

export const GET_DASHBOARD_USERS_BY_YEAR = gql`
  query GetDashboardUsersByYear($year: Int!) {
    getDashboardUsersByYear(year: $year) {
      usersCount
      vendorsCount
      restaurantsCount
      ridersCount
    }
  }
`;

export const GET_DASHBOARD_ORDERS_BY_TYPE = gql`
  query GetDashboardOrdersByType {
    getDashboardOrdersByType {
      value
      label
    }
  }
`;

export const GET_DASHBOARD_SALES_BY_TYPE = gql`
  query GetDashboardSalesByType {
    getDashboardSalesByType {
      value
      label
    }
  }
`;

// Restaurant
export const GET_DASHBOARD_RESTAURANT_ORDERS = gql`
  query GetRestaurantDashboardOrdersSalesStats(
    $restaurant: String!
    $starting_date: String!
    $ending_date: String!
  ) {
    getRestaurantDashboardOrdersSalesStats(
      restaurant: $restaurant
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      totalOrders
      totalSales
      totalCODOrders
      totalCardOrders
    }
  }
`;

export const GET_DASHBOARD_RESTAURANT_SALES_ORDER_COUNT_DETAILS_BY_YEAR = gql`
  query GetRestaurantDashboardSalesOrderCountDetailsByYear(
    $restaurant: String!
    $year: Int!
  ) {
    getRestaurantDashboardSalesOrderCountDetailsByYear(
      restaurant: $restaurant
      year: $year
    ) {
      salesAmount
      ordersCount
    }
  }
`;

export const GET_DASHBOARD_ORDER_SALES_DETAILS_BY_PAYMENT_METHOD = gql`
  query GetDashboardOrderSalesDetailsByPaymentMethod(
    $restaurant: String!
    $starting_date: String!
    $ending_date: String!
  ) {
    getDashboardOrderSalesDetailsByPaymentMethod(
      restaurant: $restaurant
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      all {
        _type
        data {
          total_orders
          total_sales
          total_sales_without_delivery
          total_delivery_fee
        }
      }
      cod {
        _type
        data {
          total_orders
          total_sales
          total_sales_without_delivery
          total_delivery_fee
        }
      }
      card {
        _type
        data {
          total_orders
          total_sales
          total_sales_without_delivery
          total_delivery_fee
        }
      }
    }
  }
`;

// Vendor

export const GET_STORE_DETAILS_BY_VENDOR_ID = gql`
  query GetStoreDetailsByVendorId(
    $id: String!
    $dateKeyword: String
    $starting_date: String
    $ending_date: String
  ) {
    getStoreDetailsByVendorId(
      id: $id
      dateKeyword: $dateKeyword
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      _id
      totalOrders
      restaurantName
      totalSales
      pickUpCount
      deliveryCount
    }
  }
`;

export const GET_VENDOR_DASHBOARD_STATS_CARD_DETAILS = gql`
  query GetVendorDashboardStatsCardDetails(
    $vendorId: String!
    $dateKeyword: String
    $starting_date: String!
    $ending_date: String!
  ) {
    getVendorDashboardStatsCardDetails(
      vendorId: $vendorId
      dateKeyword: $dateKeyword
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      totalRestaurants
      totalOrders
      totalSales
      totalDeliveries
    }
  }
`;

export const GET_VENDOR_LIVE_MONITOR = gql`
  query GetVendorLiveMonitorData(
    $id: String!
    $dateKeyword: String
    $starting_date: String
    $ending_date: String
  ) {
    getLiveMonitorData(
      id: $id
      dateKeyword: $dateKeyword
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      online_stores
      cancelled_orders
      delayed_orders
      ratings
    }
  }
`;

export const GET_VENDOR_DASHBOARD_GROWTH_DETAILS_BY_YEAR = gql`
  query GetVendorDashboardGrowthDetailsByYear($vendorId: String!, $year: Int!) {
    getVendorDashboardGrowthDetailsByYear(vendorId: $vendorId, year: $year) {
      totalRestaurants
      totalOrders
      totalSales
    }
  }
`;
