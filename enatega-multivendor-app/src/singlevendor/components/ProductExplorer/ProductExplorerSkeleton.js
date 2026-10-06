import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const ProductExplorerSkeleton = () => {
  const insets = useSafeAreaInsets()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <ScrollView
      style={[styles(currentTheme).container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}

    >
      {/* Search Header */}
      <View style={styles(currentTheme).searchRow}>
        <LoadingSkeleton width={40} height={40} borderRadius={20} />
        <LoadingSkeleton
          height={42}
          borderRadius={21}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* Main Categories */}
      <View style={styles(currentTheme).categoriesRow}>
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton
            key={i}
            width={i === 0 ? 110 : 90}
            height={36}
            borderRadius={18}
            style={{ marginRight: 8 }}
          />
        ))}
      </View>

      <ProductGrid styles={styles(currentTheme)} />
    </ScrollView>
  )
}

// Mirrors the grid ProductCard (framed image, two-line name, price) so the
// real tiles swap in without a layout jump.
const ProductGrid = ({ styles: themedStyles }) => (
  <View style={themedStyles.grid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={themedStyles.card}>
        <LoadingSkeleton width='100%' height={140} borderRadius={12} />
        <View style={themedStyles.cardCopy}>
          <LoadingSkeleton width='80%' height={14} borderRadius={6} />
          <LoadingSkeleton width='60%' height={11} borderRadius={6} style={{ marginTop: 6 }} />
          <LoadingSkeleton width='42%' height={16} borderRadius={8} style={{ marginTop: 10 }} />
        </View>
      </View>
    ))}
  </View>
)

// Product grid placeholder shown inside a category page while its products load.
export const ProductGridSkeleton = ({ style }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <ScrollView
      style={[styles(currentTheme).pageContainer, style]}
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      <ProductGrid styles={styles(currentTheme)} />
    </ScrollView>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: currentTheme.themeBackground
  },

  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: currentTheme.themeBackground
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    marginBottom: 8
  },

  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 16
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  card: {
    width: '48.8%',
    marginBottom: 8,
    padding: 5,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: currentTheme.colorBorder || currentTheme.newBorderColor2
  },

  cardCopy: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 4
  }
})

export default ProductExplorerSkeleton
