import gql from 'graphql-tag'
import { login, acceptOrder, cancelOrder } from './mutations'
import { orders } from './queries'
import { subscribePlaceOrder, subscribeOrderStatus } from './subscriptions'

export const mocks = [
  {
    request: {
      query: gql`
        ${login}
      `,
      variables: { username: 'test', password: '123' }
    },
    result: {
      data: {
        restaurantLogin: { token: 'sometoken' }
        // can also return restaurantId and save it in storage for subscriptionPlaceOrder
      }
    }
  },
  {
    request: {
      query: gql`
        ${login}
      `,
      variables: { username: 'test1', password: '123' }
    },
    error: new Error('incorrect username or password')
  },
  {
    request: {
      query: gql`
        ${acceptOrder}
      `,
      variables: { _id: '1' }
    },
    result: {
      data: {
        acceptOrder: {
          _id: '1',
          orderId: 'o-1',
          orderStatus: 'ACCEPTED',
          rider: null
        }
      }
    }
  },
  {
    request: {
      query: gql`
        ${cancelOrder}
      `,
      variables: { _id: '2', reason: 'not available' }
    },
    result: {
      data: {
        cancelOrder: {
          _id: '2',
          orderId: 'o-2',
          orderStatus: 'CANCELLED',
          rider: null
        }
      }
    }
  },
  {
    request: {
      query: gql`
        ${orders}
      `
    },
    result: {
      data: {
        restaurantOrders: [
          {
            _id: '1',
            orderId: 'o-1',
            orderStatus: 'PENDING',
            rider: null
          },
          {
            _id: '2',
            orderId: 'o-2',
            orderStatus: 'PENDING',
            rider: null
          },
          {
            _id: '3',
            orderId: 'o-3',
            orderStatus: 'PENDING',
            rider: null
          },
          {
            _id: '4',
            orderId: 'o-4',
            orderStatus: 'ACCEPTED',
            rider: null
          },
          {
            _id: '5',
            orderId: 'o-5',
            orderStatus: 'ACCEPTED',
            rider: null
          },
          {
            _id: '6',
            orderId: 'o-6',
            orderStatus: 'ACCEPTED',
            rider: null
          },
          {
            _id: '7',
            orderId: 'o-7',
            orderStatus: 'DELIVERED',
            rider: null
          },
          {
            _id: '8',
            orderId: 'o-8',
            orderStatus: 'DELIVERED',
            rider: null
          },
          {
            _id: '9',
            orderId: 'o-9',
            orderStatus: 'DELIVERED',
            rider: null
          }
        ]
      }
    }
  },
  {
    request: {
      query: gql`
        ${subscribePlaceOrder}
      `,
      variables: { restId: '123' }
    },
    result: {
      data: {
        subscribePlaceOrder: {
          origin: 'new',
          order: {
            _id: '10',
            orderId: 'o-10',
            orderStatus: 'PENDING',
            rider: null
          }
        }
      }
    }
  },
  {
    request: {
      query: gql`
        ${subscribePlaceOrder}
      `,
      variables: { restId: '123' }
    },
    result: {
      data: {
        subscribePlaceOrder: {
          origin: 'update',
          order: {
            _id: '1',
            orderId: 'o-1',
            orderStatus: 'ACCEPTED',
            rider: null
          }
        }
      }
    }
  },
  {
    request: {
      query: gql`
        ${subscribeOrderStatus}
      `,
      variables: { _id: '4' }
    },
    result: {
      data: {
        subscribeOrderStatus: {
          _id: '4',
          orderId: 'o-4',
          orderStatus: 'DELIVERED',
          rider: null
        }
      }
    }
  },
  {
    request: {
      query: gql`
        ${subscribeOrderStatus}
      `,
      variables: { _id: '3' }
    },
    result: {
      data: {
        subscribeOrderStatus: {
          _id: '3',
          orderId: 'o-3',
          orderStatus: 'ACCEPTED',
          rider: null
        }
      }
    }
  }
]
