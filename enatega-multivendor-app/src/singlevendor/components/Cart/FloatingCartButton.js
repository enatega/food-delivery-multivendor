import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useCartStore from '../../stores/useCartStore'


const FloatingCartButton = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const items = useCartStore((state) => state.items)

  // 🔢 Total quantity from all variations
  const cartCount = items.reduce((total, food) => {
    const variationCount = food.variations?.reduce(
      (sum, v) => sum + (v.quantity || 0),
      0
    )
    return total + variationCount
  }, 0)

  if (cartCount === 0) return null

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      <Pressable
        onPress={() => navigation.navigate('cart')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed
        ]}
      >
        <Icon name="cart" size={22} color="#fff" />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default FloatingCartButton

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 999
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#1E88E5',
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
