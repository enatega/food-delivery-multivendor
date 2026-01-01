import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import useHome from '../../screens/Home/useHome'
import HorizontalCategoriesList from '../HorizontalCategoriesList'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { FlashList } from '@shopify/flash-list'
import RenderCategoryCard from '../RenderCategoryCard'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'

const AllCategories = ({ currentTheme, t, handleSeeAll }) => {

  const { data } = useHome()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor

  return (
    <>
      <TextDefault H3 bolder>
        {t('All Categories')}
      </TextDefault>
      <FlashList
        data={categoriesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <RenderCategoryCard widthSize={100} item={item} currentTheme={currentTheme} handleCategoryPress={handleSeeAll} />
          </View>
        )}
        numColumns={3}
        estimatedItemSize={190}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 12 }}>
            <HorizontalProductsEmptyView />
          </View>
        }
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

export default React.memo(AllCategories)
