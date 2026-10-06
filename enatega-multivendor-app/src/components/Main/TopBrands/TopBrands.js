import React, { useContext, useMemo, useCallback } from 'react'
import { View } from 'react-native'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { LocationContext } from '../../../context/Location'
import { topRatedVendorsInfo } from '../../../apollo/queries'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import TopBrandsLoadingUI from '../LoadingUI/TopBrandsLoadingUI'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { isOpen, sortRestaurantsByOpenStatus } from '../../../utils/customFunctions'
import HorizontalFlashList from '../../Lists/HorizontalFlashList'
import { SectionAction, SectionHeader, useMultivendorTheme } from '../../../ui/designSystem'
import BrandCard, { BRAND_CARD_WIDTH } from './BrandCard'

const keyExtractor = (item) => item?._id

function TopBrands() {
  const { t, i18n } = useTranslation()
  const { location } = useContext(LocationContext)
  const isRTL = i18n.dir() === 'rtl'
  const { tokens } = useMultivendorTheme()
  const navigation = useNavigation()
  const topBrandsVariables = useMemo(() => ({
    latitude: location?.latitude,
    longitude: location?.longitude
  }), [location?.latitude, location?.longitude])

  const { loading, error, data } = useQuery(topRatedVendorsInfo, {
    variables: topBrandsVariables,
    fetchPolicy: 'cache-and-network'
  })

  const topRatedVendors = useMemo(() => data?.topRatedVendorsPreview ?? [], [data])
  const restaurantBrands = useMemo(() => topRatedVendors.filter((item) => item.shopType === 'restaurant'), [topRatedVendors])
  const groceryBrands = useMemo(() => topRatedVendors.filter((item) => item.shopType === 'grocery'), [topRatedVendors])
  const sortedRestaurantBrands = useMemo(() => sortRestaurantsByOpenStatus(restaurantBrands || []), [restaurantBrands])
  const sortedGroceryBrands = useMemo(() => sortRestaurantsByOpenStatus(groceryBrands || []), [groceryBrands])

  const openBrand = useCallback((item) => navigation.navigate('Restaurant', { ...item }), [navigation])
  const minsLabel = t('mins')
  const newLabel = t('New', { defaultValue: 'New' })
  const closedLabel = t('Closed', { defaultValue: 'Closed' })
  // Open brands lead the spotlight rail; closed ones stay visible but dimmed.
  const sortedBrands = useMemo(() => sortRestaurantsByOpenStatus(topRatedVendors), [topRatedVendors])
  const renderBrandItem = useCallback(
    ({ item }) => (
      <BrandCard
        item={item}
        tokens={tokens}
        minsLabel={minsLabel}
        newLabel={newLabel}
        closedLabel={closedLabel}
        isOpen={isOpen(item)}
        onPress={openBrand}
      />
    ),
    [tokens, minsLabel, newLabel, closedLabel, openBrand]
  )
  const railContentStyle = useMemo(() => ({
    flexGrow: 1,
    paddingStart: tokens.spacing.md
  }), [tokens])
  const renderRestaurantItem = useCallback(({ item }) => {
    const restaurantOpen = isOpen(item)
    return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
  }, [])

  if (loading && !data) return <TopBrandsLoadingUI />
  if (error) return null

  return (
    <View style={styles().mainContainer}>
      {topRatedVendors?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Our brands')}
            action={<SectionAction label={t('SeeAll')} onPress={() => {
              navigation.navigate('Menu', {
                selectedType: '',
                queryType: 'topBrands'
              })
            }} />}
          />
          <HorizontalFlashList data={sortedBrands} renderItem={renderBrandItem} keyExtractor={keyExtractor} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={BRAND_CARD_WIDTH + tokens.spacing.md} itemSpacing={tokens.spacing.md} />
        </View>
      )}

      {restaurantBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Top Restaurant Brands')}
            action={<SectionAction label={t('SeeAll')} onPress={() => {
              navigation.navigate('Menu', {
                selectedType: 'restaurant',
                queryType: 'topBrands',
                shopType: 'restaurant'
              })
            }} />}
          />
          <HorizontalFlashList data={sortedRestaurantBrands} renderItem={renderRestaurantItem} keyExtractor={keyExtractor} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={224} />
        </View>
      )}

      {groceryBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Top Grocery Brands')}
            action={<SectionAction label={t('SeeAll')} onPress={() => {
              navigation.navigate('Menu', {
                selectedType: 'grocery',
                queryType: 'topBrands',
                shopType: 'grocery'
              })
            }} />}
          />
          <HorizontalFlashList data={sortedGroceryBrands} renderItem={renderRestaurantItem} keyExtractor={keyExtractor} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={224} />
        </View>
      )}
    </View>
  )
}

export default React.memo(TopBrands)
