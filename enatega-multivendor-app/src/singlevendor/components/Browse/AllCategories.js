import { View } from 'react-native'
import React from 'react'
import { useQuery } from '@apollo/client'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { FlashList } from '@shopify/flash-list'
import RenderCategoryCard from '../RenderCategoryCard'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
import SectionErrorCard from '../SectionErrorCard'
import { GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR } from '../../apollo/queries'

const AllCategories = ({ currentTheme, t, handleSeeAll }) => {
  const { data, error, refetch } = useQuery(GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR)
  const categoriesData = data?.getRestaurantCategoriesSingleVendor

  if (error) {
    return (
      <SectionErrorCard
        title={t('All Categories')}
        onRetry={refetch}
        style={{ marginHorizontal: 0 }}
      />
    )
  }

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
