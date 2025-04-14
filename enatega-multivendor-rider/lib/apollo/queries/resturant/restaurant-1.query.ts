export const restaurantFragment = `#graphql
  fragment RestaurantFields on Restaurant {
    _id
    orderId
    orderPrefix
    name
    image
    address
    location {
      coordinates
    }
    categories {
      _id
      title
      foods {
        _id
        title
        description
        subCategory
        variations {
          _id
          title
          price
          discounted
          addons
        }
        image
        isActive
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
    options {
      _id
      title
      description
      price
    }
    addons {
      _id
      options
      title
      description
      quantityMinimum
      quantityMaximum
    }
    reviewData {
      reviews {
        _id
        order {
          _id
          orderId
          restaurant {
            _id
            name
            image
            address
            slug
          }
          deliveryAddress {
            deliveryAddress
            details
            label
          }
          items {
            _id
            title
            food
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
              title
              description
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
            phoneIsVerified
            email
            emailIsVerified
            password
            isActive
            isOrderNotification
            isOfferNotification
            createdAt
            updatedAt
            addresses {
              _id
              deliveryAddress
              details
              label
              selected
            }
            notificationToken
            favourite
            userType
          }
          paymentMethod
          paidAmount
          orderAmount
          status
          paymentStatus
          orderStatus
          reason
          isActive
          createdAt
          updatedAt
          deliveryCharges
          tipping
          taxationAmount
          rider {
            _id
            name
            email
            username
            password
            phone
            image
            available
            isActive
            createdAt
            updatedAt
            accountNumber
            currentWalletAmount
            totalWalletAmount
            withdrawnWalletAmount
          }
          review {
            _id
            rating
            description
            isActive
            createdAt
            updatedAt
          }
          completionTime
          orderDate
          expectedTime
          preparationTime
          isPickedUp
          acceptedAt
          pickedAt
          deliveredAt
          cancelledAt
          assignedAt
          isRinged
          isRiderRinged
        }
        restaurant {
          _id
          orderId
          orderPrefix
          name
          image
          address
          username
          password
          deliveryTime
          minimumOrder
          sections
          rating
          isActive
          isAvailable
          slug
          stripeDetailsSubmitted
          commissionRate
          tax
          notificationToken
          enableNotification
          shopType
        }
        rating
        description
        isActive
        createdAt
        updatedAt
      }
      ratings
      total
    }
    zone {
      _id
      title
      tax
      description
      location {
        coordinates
      }
      isActive
    }
    username
    password
    deliveryTime
    minimumOrder
    sections
    rating
    isActive
    isAvailable
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
    slug
    stripeDetailsSubmitted
    commissionRate
    owner {
      _id
      email
    }
    deliveryBounds {
      coordinates
    }
    tax
    notificationToken
    enableNotification
    shopType
  }
`;
