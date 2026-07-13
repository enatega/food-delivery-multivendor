import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const ProductExplorerSkeleton = () => {
    const insets = useSafeAreaInsets()
  return (
    <ScrollView
      style={[styles.container,{paddingTop:insets.top}]}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}

    >
      {/* Search Header */}
      <View style={styles.searchRow}>
        <LoadingSkeleton width={36} height={36} borderRadius={18} />
        <LoadingSkeleton
          width="85%"
          height={40}
          borderRadius={20}
          style={{ marginLeft: 12 }}
        />
      </View>

      {/* Main Categories */}
      <View style={styles.categoriesRow}>
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton
            key={i}
            width={90}
            height={22}
            borderRadius={11}
            style={{ marginRight: 16 }}
          />
        ))}
      </View>

      {/* Sub Categories */}
      <View style={styles.subCategoriesRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton
            key={i}
            width={80}
            height={32}
            borderRadius={16}
            style={{ marginRight: 10 }}
          />
        ))}
      </View>

      {/* Product Grid */}
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.card}>
            {/* Image */}
            <LoadingSkeleton width="100%" height={120} borderRadius={12} />

            {/* Price */}
            <LoadingSkeleton
              width={60}
              height={14}
              borderRadius={7}
              style={{ marginTop: 10 }}
            />

            {/* Title */}
            <LoadingSkeleton
              width="80%"
              height={16}
              borderRadius={8}
              style={{ marginTop: 6 }}
            />

            {/* Subtitle */}
            <LoadingSkeleton
              width="50%"
              height={12}
              borderRadius={6}
              style={{ marginTop: 6 }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  subCategoriesRow: {
    flexDirection: 'row',
    marginBottom: 22,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 18,
  },
})


export default ProductExplorerSkeleton
