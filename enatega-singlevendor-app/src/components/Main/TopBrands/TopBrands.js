import React, { useContext, useMemo, useCallback } from 'react'
import { View, Image } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import { LocationContext } from '../../../context/Location'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { topRatedVendorsInfo } from '../../../apollo/queries'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import TopBrandsLoadingUI from '../LoadingUI/TopBrandsLoadingUI'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { isOpen, sortRestaurantsByOpenStatus } from '../../../utils/customFunctions'
import HorizontalFlashList from '../../Lists/HorizontalFlashList'
import { useCachedMediaUri } from '../../../utils/mediaCache'
import { resolveLogoImage } from '../../../utils/resolveImageUrl'
import { SectionAction, SectionHeader, useMultivendorTheme } from '../../../ui/designSystem'
import { MaterialIcons } from '@expo/vector-icons'

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

  const RenderItem = ({ item }) => (
    <TouchableOpacity style={styles(tokens).topbrandsContainer} onPress={() => navigation.navigate('Restaurant', { ...item })}>
      <View style={styles(tokens).brandImgContainer}>
        <Image source={{ uri: useCachedMediaUri(resolveLogoImage(item), 'image') }} style={styles(tokens).brandImg} resizeMode='contain' />
        <View style={styles(tokens).deliveryBadge}>
          <MaterialIcons name='schedule' size={12} color={tokens.colors.accent} />
          <TextDefault style={styles(tokens).deliveryBadgeText} textColor={tokens.colors.textPrimary} numberOfLines={1}>
            {item?.deliveryTime} {t('mins')}
          </TextDefault>
        </View>
      </View>

      <View style={styles(tokens).brandTextContainer}>
        <TextDefault style={styles(tokens).brandName} textColor={tokens.colors.textPrimary} numberOfLines={2} ellipsizeMode='tail' bolder>
          {item?.name}
        </TextDefault>
      </View>
    </TouchableOpacity>
  )

  const topRatedVendors = useMemo(() => data?.topRatedVendorsPreview ?? [], [data])
  const restaurantBrands = useMemo(() => topRatedVendors.filter((item) => item.shopType === 'restaurant'), [topRatedVendors])
  const groceryBrands = useMemo(() => topRatedVendors.filter((item) => item.shopType === 'grocery'), [topRatedVendors])
  const sortedRestaurantBrands = useMemo(() => sortRestaurantsByOpenStatus(restaurantBrands || []), [restaurantBrands])
  const sortedGroceryBrands = useMemo(() => sortRestaurantsByOpenStatus(groceryBrands || []), [groceryBrands])

  const renderBrandItem = useCallback(({ item }) => <RenderItem item={item} />, [navigation, tokens])
  const renderRestaurantItem = useCallback(({ item }) => {
    const restaurantOpen = isOpen(item)
    return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
  }, [])

  if (loading) return <TopBrandsLoadingUI />
  if (error) return null

  const railContentStyle = {
    flexGrow: 1,
    paddingStart: tokens.spacing.md
  }

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
          <HorizontalFlashList data={topRatedVendors} renderItem={renderBrandItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={96} itemSpacing={tokens.spacing.lg} />
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
          <HorizontalFlashList data={sortedRestaurantBrands} renderItem={renderRestaurantItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={224} />
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
          <HorizontalFlashList data={sortedGroceryBrands} renderItem={renderRestaurantItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={224} />
        </View>
      )}
    </View>
  )
}

export default React.memo(TopBrands)
