import React, { useContext, useMemo, useCallback } from 'react'
import { View, Image, Dimensions, Platform } from 'react-native'
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
import { SectionHeader, useMultivendorTheme } from '../../../ui/designSystem'

const { height } = Dimensions.get('window')
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
      </View>

      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
        }}
      >
        <TextDefault style={styles(tokens).brandName} textColor={tokens.colors.textPrimary} numberOfLines={2} ellipsizeMode='tail' bolder>
          {item?.name}
        </TextDefault>
        <TextDefault textColor={tokens.colors.textSecondary} normal>
          {item?.deliveryTime} mins
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

  const seeAllAction = (onPress) => (
    <TouchableOpacity style={styles(tokens).seeAllBtn} activeOpacity={0.7} onPress={onPress}>
      <TextDefault bolder textColor={tokens.colors.accent}>{t('SeeAll')}</TextDefault>
    </TouchableOpacity>
  )

  const railContentStyle = {
    flexGrow: 1,
    paddingStart: tokens.spacing.lg
  }

  return (
    <View style={styles().mainContainer}>
      {topRatedVendors?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Our brands')}
            action={seeAllAction(() => {
              navigation.navigate('Menu', {
                selectedType: '',
                queryType: 'topBrands'
              })
            })}
          />
          <HorizontalFlashList data={topRatedVendors} renderItem={renderBrandItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={140} itemSpacing={tokens.spacing.md} />
        </View>
      )}

      {restaurantBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Top Restaurant Brands')}
            action={seeAllAction(() => {
              navigation.navigate('Menu', {
                selectedType: 'restaurant',
                queryType: 'topBrands',
                shopType: 'restaurant'
              })
            })}
          />
          <View style={{ height: height * (Platform.OS === 'ios' ? 0.395 : 0.370) }}>
            <HorizontalFlashList data={sortedRestaurantBrands} renderItem={renderRestaurantItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={280} />
          </View>
        </View>
      )}

      {groceryBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <SectionHeader
            style={styles(tokens).sectionHeader}
            title={t('Top Grocery Brands')}
            action={seeAllAction(() => {
              navigation.navigate('Menu', {
                selectedType: 'grocery',
                queryType: 'topBrands',
                shopType: 'grocery'
              })
            })}
          />
          <HorizontalFlashList data={sortedGroceryBrands} renderItem={renderRestaurantItem} keyExtractor={(item) => item?._id} contentContainerStyle={railContentStyle} inverted={isRTL} estimatedItemSize={280} />
        </View>
      )}
    </View>
  )
}

export default React.memo(TopBrands)
