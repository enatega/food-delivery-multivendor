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

import React from 'react'
import CartQuantityController from './CartQuantityController'

const CartItemController = ({ item }) => {
  const variation = item?.variations?.[0]

  return (
    <CartQuantityController
      foodId={item?.foodId}
      categoryId={item?.categoryId}
      variationId={variation?._id || variation?.variationId}
      addons={[]}
      defaultQuantity={variation?.quantity || 1}
      variant="details"
    />
  )
}

export default CartItemController
