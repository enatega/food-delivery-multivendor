// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useContext, useState } from 'react'
// import styles from './styles'
// import { AntDesign } from '@expo/vector-icons'
// import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
// import { useTranslation } from 'react-i18next'
// import { theme } from '../../../utils/themeColors'
// import TextDefault from '../../../components/Text/TextDefault/TextDefault'
// import { UPDATE_USER_CART_COUNT } from '../../apollo/mutations'
// import { useMutation } from '@apollo/client'

// const CartItemController = ({ defaultCount, onRemoveQuantity, onAddQuantity,item }) => {

//   const [updateUserCartCount, { loading: updateUserCartCountLoading, error: updateUserCartCountError }] = useMutation(UPDATE_USER_CART_COUNT, {
//     onCompleted: (data) => {
//       console.log('Cart updated:', data)
//     },
//     onError: (error) => {
//       console.error('Error updating cart:', error)
//     }
//   })

//   const { t, i18n } = useTranslation()
//   const themeContext = useContext(ThemeContext)
//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   }
//   // const [itemCount, setitemCount] = useState(defaultCount)
//   const itemCount = defaultCount;

//   const handleAddQuantity = () => {
//     const newCount = itemCount + 1
//     setitemCount((prevCount) => prevCount + 1)
//     console.log('Adding quantity, new count:', newCount);
//     updateUserCartCount({
//       variables: {
//         input: {
//           foodId: item?.foodId,
//           categoryId: item?.categoryId,
//           variationId: item?.variations[0]?.variationId,
//           action: 'increase', // or DECREMENT

//         }
//       }
//     })

//     onAddQuantity && onAddQuantity()
//   }

//   const handleRemoveQuantity = () => {
//     if (itemCount > 1) {
//       const newCount = itemCount - 1
//       setitemCount((prevCount) => prevCount - 1)
//       console.log('Removing quantity, new count:', newCount);
//       updateUserCartCount({
//         variables: {
//           input: {
//             foodId: item?.foodId,
//             categoryId: item?.categoryId,
//             variationId: item?.variations[0]?.variationId,
//             action: 'decrease', // or DECREMENT

//           }
//         }
//       })

//     }else{
//       updateUserCartCount({
//         variables: {
//           input: {
//             foodId: item?.foodId,
//             categoryId: item?.categoryId,
//             variationId: item?.variations[0]?.variationId,
//             action: 'delete',

//           }
//         }
//       })
//     }
//     onRemoveQuantity && onRemoveQuantity()
//   }

//   return (
//     <View style={[styles(currentTheme).quantityControls,{opacity: updateUserCartCountLoading ? 0.5 : 1}]}>
//       <TouchableOpacity disabled={updateUserCartCountLoading} activeOpacity={0.7} style={styles(currentTheme).quantityButton} onPress={handleRemoveQuantity}>
//         {itemCount < 2 ? <AntDesign name='delete' size={16} color={currentTheme.fontMainColor} /> : <AntDesign name='minus' size={16} color={currentTheme.fontMainColor} />}
//       </TouchableOpacity>

//       <TextDefault H5 bold textColor={currentTheme.fontMainColor} isRTL style={styles().quantityText}>
//         {itemCount}
//       </TextDefault>

//       <TouchableOpacity disabled={updateUserCartCountLoading} activeOpacity={0.7} style={styles(currentTheme).quantityButton} onPress={handleAddQuantity}>
//         <AntDesign name='plus' size={16} color={currentTheme.fontMainColor} />
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default CartItemController

import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/client'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from './styles'

import { UPDATE_USER_CART_COUNT } from '../../apollo/mutations'
import useCartStore from '../../stores/useCartStore'

const CartItemController = ({ item }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Zustand actions
  const { updateCartItemQuantity} = useCartStore()

  // Quantity ALWAYS from server → Zustand
  const quantity = item?.variations?.[0]?.quantity || 1

  const [updateUserCartCount, { loading }] = useMutation(UPDATE_USER_CART_COUNT, {
    onCompleted: (data) => {
      console.log("updateCartItemQuantity",updateCartItemQuantity);
      console.log('Cart count updated:', data,item)
      const result = data?.updateUserCartCount
      if (!result?.success) return

      updateCartItemQuantity({
        foodId: item.foodId,
        variationId: item.variations[0].variationId,
        quantity: result.quantity,
        foodTotal: result.foodTotal,
        itemTotal: result.itemTotal,
        grandTotal: result.grandTotal,
        isBelowMinimumOrder: result.isBelowMinimumOrder
      })
    },
    onError: (error) => {
      console.error('Error updating cart:', error)
    }
  })

  const handleAddQuantity = () => {
    updateUserCartCount({
      variables: {
        input: {
          foodId: item.foodId,
          categoryId: item.categoryId,
          variationId: item.variations[0].variationId,
          action: 'increase'
        }
      }
    })
  }

  const handleRemoveQuantity = () => {
    updateUserCartCount({
      variables: {
        input: {
          foodId: item.foodId,
          categoryId: item.categoryId,
          variationId: item.variations[0].variationId,
          action: quantity > 1 ? 'decrease' : 'delete'
        }
      }
    })
  }

  return (
    <View style={[styles(currentTheme).quantityControls, { opacity: loading ? 0.5 : 1 }]}>
      {/* Decrease / Delete */}
      <TouchableOpacity disabled={loading} activeOpacity={0.7} style={styles(currentTheme).quantityButton} onPress={handleRemoveQuantity}>
        {quantity <= 1 ? <AntDesign name='delete' size={16} color={currentTheme.fontMainColor} /> : <AntDesign name='minus' size={16} color={currentTheme.fontMainColor} />}
      </TouchableOpacity>

      {/* Quantity */}
      <TextDefault H5 bold textColor={currentTheme.fontMainColor} isRTL style={styles().quantityText}>
        {quantity}
      </TextDefault>

      {/* Increase */}
      <TouchableOpacity disabled={loading} activeOpacity={0.7} style={styles(currentTheme).quantityButton} onPress={handleAddQuantity}>
        <AntDesign name='plus' size={16} color={currentTheme.fontMainColor} />
      </TouchableOpacity>
    </View>
  )
}

export default CartItemController
