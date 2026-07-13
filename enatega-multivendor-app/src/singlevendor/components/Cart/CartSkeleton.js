import React, { use } from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const { width } = Dimensions.get('window')

const CartSkeleton = () => {
    const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
        <LoadingSkeleton width="32.3%" height={6} borderRadius={3} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <LoadingSkeleton width={120} height={18} style={styles.sectionTitle} />

        {/* Cart Items */}
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.cartItem}>
            {/* Product image */}
            <LoadingSkeleton width={64} height={64} borderRadius={8} />

            {/* Product info */}
            <View style={styles.itemInfo}>
              <LoadingSkeleton width="70%" height={14} />
              <LoadingSkeleton width="50%" height={12} style={{ marginTop: 6 }} />

              {/* Quantity row */}
              <View style={styles.quantityRow}>
                <LoadingSkeleton width={80} height={28} borderRadius={14} />
                <LoadingSkeleton width={50} height={14} />
              </View>
            </View>
          </View>
        ))}

        {/* Recommended Section */}
        <LoadingSkeleton width={160} height={18} style={styles.sectionTitle} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.recommendCard}>
              <LoadingSkeleton width={140} height={90} borderRadius={12} />
              <LoadingSkeleton width="80%" height={12} style={{ marginTop: 8 }} />
              <LoadingSkeleton width="60%" height={12} style={{ marginTop: 4 }} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <LoadingSkeleton width="100%" height={48} borderRadius={10} />
      </View>
    </View>
  )
}

export default CartSkeleton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection:'row',
    justifyContent:'space-between'
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
    borderBottomColor: '#F0F0F0'
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
