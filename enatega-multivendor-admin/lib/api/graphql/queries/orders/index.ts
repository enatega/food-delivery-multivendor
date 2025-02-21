import { gql } from '@apollo/client';

export const GET_ACTIVE_ORDERS = gql`
  query GetActiveOrders(
    $restaurantId: ID
    $page: Int
    $rowsPerPage: Int
    $actions: [String]
    $search: String
  ) {
    getActiveOrders(
      restaurantId: $restaurantId
      page: $page
      rowsPerPage: $rowsPerPage
      actions: $actions
      search: $search
    ) {
      totalCount
      orders {
        _id
        zone {
          _id
        }
        orderId
        restaurant {
          _id
          name
          image
          address
          location {
            coordinates
          }
        }
        deliveryAddress {
          location {
            coordinates
          }
          deliveryAddress
        }
        user {
          name
          phone
        }
        paymentMethod
        orderStatus
        isPickedUp
        status
        isActive
        createdAt
        rider {
          _id
          name
          username
          available
        }
      }
    }
  }
`;

export const GET_ORDER_BY_RESTAURANT = gql`
  query ordersByRestId(
    $restaurant: String!
    $page: Int
    $rows: Int
    $search: String
  ) {
    ordersByRestId(
      restaurant: $restaurant
      page: $page
      rows: $rows
      search: $search
    ) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
      }
      items {
        _id
        title
        description
        image
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
            _id
            title
            description
            price
          }
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user {
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;

export const GET_ORDER_BY_RESTAURANT_WITHOUT_PAGINATION = gql`
  query ordersByRestIdWithoutPagination($restaurant: String!, $search: String) {
    ordersByRestIdWithoutPagination(restaurant: $restaurant, search: $search) {
      _id
      orderId
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
      }
      items {
        _id
        title
        description
        image
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
            _id
            title
            description
            price
          }
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user {
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
    }
  }
`;

export const GET_ORDERS = gql`
  query Orders($page: Int) {
    allOrders(page: $page) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
      }
      items {
        _id
        title
        description
        image
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
            _id
            title
            description
            price
          }
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user {
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;

export const GET_ORDERS_WITHOUT_PAGINATION = gql`
  query OrdersWithoutPagination(
    $dateKeyword: String
    $starting_date: String
    $ending_date: String
  ) {
    allOrdersWithoutPagination(
      dateKeyword: $dateKeyword
      starting_date: $starting_date
      ending_date: $ending_date
    ) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
      }
      items {
        _id
        title
        description
        image
        quantity
        variation {
          _id
          title
          price
          discounted
        }
        addons {
          _id
          options {
            _id
            title
            description
            price
          }
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user {
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;
