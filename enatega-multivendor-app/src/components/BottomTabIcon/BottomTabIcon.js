import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icons } from './icons'
import UserContext from '../../context/User'
import { scale } from '../../utils/scaling'
import useCartStore from '../../singlevendor/stores/useCartStore'

const BottomTabIcon = ({ name, color, onPress, size }) => {
  const IconSVG = Icons[name]
  
  const { items } = useCartStore()
  const cartCount = items?.length;
  const showBadge = name === 'cart' && cartCount > 0

  return (
    <View style={styles.container}>
      <IconSVG color={color} size={size} onPress={onPress} />

      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartCount > 99 ? '99+' : cartCount}
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
