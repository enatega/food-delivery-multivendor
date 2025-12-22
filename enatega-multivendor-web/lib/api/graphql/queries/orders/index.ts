import { gql } from "@apollo/client";

export const ORDERS = gql`
  query Orders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
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
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
            title
            description
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
      }
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions
    }
  }
`;


export const GET_USERS_PAST_ORDERS = gql`
  query GetUsersPastOrders($page: Int!, $limit: Int!, $offset: Int!) {
    getUsersPastOrders(page: $page, limit: $limit, offset: $offset) {
     _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
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
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
            title
            description
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
      }
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions
    }
  }
`;

export const GET_USERS_ACTIVE_ORDERS = gql`
  query GetUsersActiveOrders($page: Int!, $limit: Int!, $offset: Int!) {
    getUsersActiveOrders(page: $page, limit: $limit, offset: $offset) {
    _id
      orderId
      id
      restaurant {
        _id
        name
        slug
        shopType
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
        id
      }
      items {
        _id
        id
        title
        food
        description
        quantity
        image
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          options {
            _id
            id
            title
            description
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
      }
      user {
        _id
        name
        phone
      }
      rider {
        _id
        name
        phone
      }
      review {
        _id
        rating
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      paymentStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions  
    }
  }
`;