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

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER_CART } from '../../apollo/queries'
import useCartStore from '../../stores/useCartStore'

const useCart = () => {
  const { setCartFromServer, setLoading, setError } = useCartStore()

  const { data, loading, error, refetch } = useQuery(GET_USER_CART)

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    console.log('Cart data from server:', JSON.stringify(data), error)
    if (data?.getUserCart?.success) {
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
