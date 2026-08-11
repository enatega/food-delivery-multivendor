import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import CategoryItem from './ProductExplorer/CategoryItem'

const HorizontalSubCategoriesList = ({
  data = [],
  activeIndex = 0,
  onSubCategoryPress,
  listRef
}) => {
  const internalRef = useRef(null)
  const ref = listRef || internalRef

  const handlePress = (index) => {
    if (onSubCategoryPress) {
      onSubCategoryPress(index)
    }
  }

  return (
    <FlashList
      style={styles.subcategoryList}
      ref={ref}
      horizontal
      data={data}
      keyExtractor={(item) => item?.subCategoryId || item?.id || String(item)}
      estimatedItemSize={80}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item.subCategoryName || item.name || String(item)}
          active={ index === activeIndex}
          onPress={() => {
            handlePress(index)
          }}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  )
}

export default HorizontalSubCategoriesList

const styles = StyleSheet.create({
  subcategoryList: { marginTop: 10, marginBottom: 22 }
})

