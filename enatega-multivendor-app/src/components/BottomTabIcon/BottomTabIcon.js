import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icons } from './icons'
import UserContext from '../../context/User'
import { scale } from '../../utils/scaling'
import useCartStore from '../../singlevendor/stores/useCartStore'

const BottomTabIcon = ({ name, color, onPress, size }) => {
  const IconSVG = Icons[name]
  
  // const { items } = useCartStore()
  

    const items = useCartStore((state) => state.items)

  const totalQuantity = items?.reduce((sum, item) => {
    const variationsTotal = item?.variations?.reduce((vSum, v) => vSum + (v?.quantity || 0), 0)
    const itemQuantity = typeof variationsTotal === 'number' ? variationsTotal : (item?.quantity || 0)
    return sum + itemQuantity
  }, 0)

  

  const showBadge = name === 'cart' && totalQuantity > 0

  return (
    <View style={styles.container}>
      <IconSVG color={color} size={size} onPress={onPress} />

      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: scale(32),
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4)
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700'
  }
})

export default BottomTabIcon
