// import { useQuery } from '@apollo/client'
// import { GET_USER_CART } from '../../apollo/queries'

// const useCart = ({} = {}) => {
//   const { data, loading, error, refetch } = useQuery(GET_USER_CART, {
//     variables: {}
//   })

//   const cartData = {
//     cartItems: data?.getUserCart?.foods || [],
//     totalAmount: data?.getUserCart?.grandTotal || 0,
//     isCartEmpty: data?.getUserCart?.foods?.length === 0
//   }

//   return {
//     loading,
//     cartData,
//     error,
//     refetch
//   }
// }

// export default useCart

import { useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER_CART } from '../../apollo/queries'
import useCartStore from '../../stores/useCartStore'
import useNetworkStatus from '../../../utils/useNetworkStatus'

const useCart = () => {
  const { setCartFromServer, setLoading, setError, setHasFetchedCart, hasFetchedCart } = useCartStore()
  const { isConnected } = useNetworkStatus()
  const wasOfflineRef = useRef(false)
  const { data, loading, error, refetch } = useQuery(GET_USER_CART, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !isConnected || hasFetchedCart
  })

  useEffect(() => {
    if (!isConnected) {
      wasOfflineRef.current = true
      return
    }
    if (wasOfflineRef.current) {
      wasOfflineRef.current = false
      refetch?.()
    }
  }, [isConnected, refetch])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    console.log('Cart data from server:', JSON.stringify(data), error)
    if (data?.getUserCart?.success) {
      setHasFetchedCart(true)
      setCartFromServer({
        cartId: data.getUserCart.cartId,
        foods: data.getUserCart.foods,
        grandTotal: data.getUserCart.discountedGrandTotal,
        // grandTotal: data.getUserCart.actualGrandTotal,
        maxOrderAmount: data.getUserCart.maxOrderAmount,
        minOrderAmount: data.getUserCart.minOrderAmount,
        isBelowMinimumOrder: data.getUserCart.isBelowMinimumOrder,
        lowOrderFees: data.getUserCart.lowOrderFees
      })
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setError(error.message)
    }
  }, [error])

  return {
    refetch
  }
}

export default useCart
