import { gql } from "@apollo/client";

export const GET_ORDERS =
  // @multi-vendor-only
  gql`
    query Orders {
      restaurantOrders {
        _id
        orderId
        id
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
          id
          title
          description
          image
          quantity
          specialInstructions

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
        tipping
        taxationAmount
        status
        paymentStatus
        reason
        isActive
        createdAt
        orderDate
        pickedAt
        deliveryCharges
        isPickedUp
        preparationTime
        eta {
          phase
          source
          readyAt
          estimatedArrivalAt
          windowStartAt
          windowEndAt
          calculatedAt
          lastLocationAt
        }
        acceptedAt
        isRinged
        instructions
        rider {
          _id
          name
          username
          available
        }
        discountAmount
      }
    }
  `;

export const GET_ORDERS_SINGLE_VENDOR = gql`
  query SingleVendorStoreOrders {
    restaurantOrders {
      _id
      orderId
      id
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
        id
        title
        description
        image
        quantity
        specialInstructions
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
          description
          title
          quantityMinimum
          quantityMaximum
        }
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
      tipping
      taxationAmount
      status
      paymentStatus
      reason
      isActive
      createdAt
      orderDate
      pickedAt
      deliveryCharges
      isPickedUp
      preparationTime
      acceptedAt
      isRinged
      instructions
      eta {
        phase
        source
        readyAt
        baseArrivalAt
        estimatedArrivalAt
        windowStartAt
        windowEndAt
        durationSeconds
        distanceMeters
        encodedPolyline
        calculatedAt
        lastLocationAt
        version
      }
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;
