import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const CartSkeleton = () => {
  const insets = useSafeAreaInsets()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={[styles(currentTheme).container, { paddingTop: insets.top }]}>
      {/* Progress bar */}
      <View style={styles(currentTheme).progressContainer}>
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
      </View>

      <ScrollView contentContainerStyle={styles(currentTheme).content}>
        {/* Title */}
        <LoadingSkeleton width={120} height={18} style={styles(currentTheme).sectionTitle} />

        {/* Cart Items */}
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles(currentTheme).cartItem}>
            {/* Product image */}
            <LoadingSkeleton width={64} height={64} borderRadius={8} />

            {/* Product info */}
            <View style={styles(currentTheme).itemInfo}>
              <LoadingSkeleton width="70%" height={14} />
              <LoadingSkeleton width="50%" height={12} style={{ marginTop: 6 }} />

              {/* Quantity row */}
              <View style={styles(currentTheme).quantityRow}>
                <LoadingSkeleton width={80} height={28} borderRadius={14} />
                <LoadingSkeleton width={50} height={14} />
              </View>
            </View>
          </View>
        ))}

        {/* Recommended Section */}
        <LoadingSkeleton width={160} height={18} style={styles(currentTheme).sectionTitle} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles(currentTheme).recommendCard}>
              <LoadingSkeleton width={140} height={90} borderRadius={12} />
              <LoadingSkeleton width="80%" height={12} style={{ marginTop: 8 }} />
              <LoadingSkeleton width="60%" height={12} style={{ marginTop: 4 }} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles(currentTheme).checkoutContainer}>
        <LoadingSkeleton width="100%" height={48} borderRadius={10} />
      </View>
    </View>
  )
}

export default CartSkeleton

const styles = (currentTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme.themeBackground
  },

  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 120
  },

  sectionTitle: {
    marginVertical: 16
  },

  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: currentTheme.colorBorder
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },

  quantityRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  recommendCard: {
    marginRight: 12,
    width: 160
  },

  checkoutContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16
  }
})
