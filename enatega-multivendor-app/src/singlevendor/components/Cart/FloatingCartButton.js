import React, { useContext } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import useCartStore from '../../stores/useCartStore'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const FloatingCartButton = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const items = useCartStore((state) => state.items)

  const totalQuantity = items?.reduce((sum, item) => {
    const variationsTotal = item?.variations?.reduce((vSum, v) => vSum + (v?.quantity || 0), 0)
    const itemQuantity = typeof variationsTotal === 'number' ? variationsTotal : (item?.quantity || 0)
    return sum + itemQuantity
  }, 0)

  if (!totalQuantity) return null

  return (
    <View style={[styles(currentTheme).container, { bottom: insets.bottom + 16 }]}>
      <Pressable
        onPress={() => navigation.navigate('Cart')}
        style={({ pressed }) => [
          styles(currentTheme).button,
          pressed && styles(currentTheme).pressed
        ]}
      >
        <MaterialCommunityIcons name='cart' size={22} color={currentTheme.singleVendorOnBrand} />

        <View style={styles(currentTheme).badge}>
          <Text style={styles(currentTheme).badgeText}>{totalQuantity}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default FloatingCartButton

const styles = (currentTheme = {}) => StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 999
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: currentTheme.singleVendorBrand,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10
  },

  pressed: {
    transform: [{ scale: 0.95 }]
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3D00',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
})
