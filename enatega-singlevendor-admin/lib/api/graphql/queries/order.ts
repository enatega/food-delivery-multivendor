'use client';
import { gql } from '@apollo/client';

export const GET_ORDERS_BY_USER = gql`
  query OrdersByUser($userId: ID!, $page: Int, $limit: Int) {
    ordersByUser(userId: $userId, page: $page, limit: $limit) {
      orders {
        _id
        orderId
        orderAmount
        orderStatus
        paymentMethod
        createdAt
        deliveryCharges
        paidAmount
        taxationAmount
        tipping
        restaurant {
          _id
          name
        }
        deliveryAddress {
          deliveryAddress
          details
          label
          location {
            coordinates
          }
        }
        items {
          _id
          title
          description
          quantity
          image
          specialInstructions
          variation {
            _id
            title
            price
          }
          addons {
            _id
            title
            options {
              _id
              title
              price
            }
          }
        }
      }
      totalCount
      totalPages
      currentPage
      nextPage
      prevPage
    }
  }
`;
