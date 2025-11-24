import React, { useContext } from 'react'
import { View, FlatList, Text, Image, Dimensions } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { LocationContext } from '../../../context/Location'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { topRatedVendorsInfo } from '../../../apollo/queries'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import TopBrandsLoadingUI from '../LoadingUI/TopBrandsLoadingUI'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { isOpen, sortRestaurantsByOpenStatus } from '../../../utils/customFunctions'

const { height } = Dimensions.get('window')
function TopBrands(props) {
  const { t, i18n } = useTranslation()
  const { location } = useContext(LocationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const navigation = useNavigation()

  const { loading, error, data } = useQuery(topRatedVendorsInfo, {
    variables: {
      latitude: location?.latitude,
      longitude: location?.longitude
    }
  })
  const RenderItem = ({ item }) => (
    <TouchableOpacity style={styles().topbrandsContainer} onPress={() => navigation.navigate('Restaurant', { ...item })}>
      <View style={styles().brandImgContainer}>
        <Image source={{ uri: item?.logo }} style={styles().brandImg} resizeMode='contain' />
      </View>

      <View
        style={{
          alignItems: 'left',
          justifyContent: 'center'
        }}
      >
        <TextDefault style={styles().brandName} textColor={currentTheme.fontThirdColor} H5 bolder>
          {item?.name?.length > 11 ? item.name.substring(0, 11) + '...' : item.name}
        </TextDefault>
        <TextDefault textColor={currentTheme.fontFifthColor} normal>
          {item?.deliveryTime} mins
        </TextDefault>
      </View>
    </TouchableOpacity>
  )

  if (loading) return <TopBrandsLoadingUI />
  if (error) return <Text style={styles().margin}>Error: {error.message}</Text>

  const restaurantBrands = data?.topRatedVendorsPreview?.filter((item) => item.shopType === 'restaurant')

  const groceryBrands = data?.topRatedVendorsPreview?.filter((item) => item.shopType === 'grocery')

  return (
    <View style={styles().mainContainer}>
      {data?.topRatedVendorsPreview?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <View style={styles(currentTheme).header}>
            <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} bolder H4>
              {t('Our brands')}
            </TextDefault>
            <TouchableOpacity
              style={styles(currentTheme).seeAllBtn}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Menu', {
                  selectedType: '',
                  queryType: 'topBrands'
                })
              }}
            >
              <TextDefault H5 bolder textColor={currentTheme.main}>
                {t('SeeAll')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <View style={{ ...alignment.PRsmall }}>
            <FlatList
              data={data?.topRatedVendorsPreview}
              renderItem={({ item }) => {
                return <RenderItem item={item} />
              }}
              keyExtractor={(item) => item?._id}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              inverted={currentTheme?.isRTL ? true : false}
            />
          </View>
        </View>
      )}

      {restaurantBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <View style={styles(currentTheme).header}>
            <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} bolder H4>
              {t('Top Restaurant Brands')}
            </TextDefault>
            <TouchableOpacity
              style={styles(currentTheme).seeAllBtn}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Menu', {
                  selectedType: 'restaurant',
                  queryType: 'topBrands',
                  shopType: 'restaurant'
                })
              }}
            >
              <TextDefault H5 bolder textColor={currentTheme.main}>
                {t('SeeAll')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <View style={{ ...alignment.PRsmall, height: height * 0.384 }}>
            <FlatList
              data={sortRestaurantsByOpenStatus(restaurantBrands || [])}
              renderItem={({ item }) => {
                const restaurantOpen = isOpen(item)
                return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
              }}
              keyExtractor={(item) => item?._id}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              inverted={currentTheme?.isRTL ? true : false}
            />
          </View>
        </View>
      )}

      {groceryBrands?.length > 0 && (
        <View style={styles().topbrandsSec}>
          <View style={styles(currentTheme).header}>
            <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} bolder H4>
              {t('Top Grocery Brands')}
            </TextDefault>
            <TouchableOpacity
              style={styles(currentTheme).seeAllBtn}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Menu', {
                  selectedType: 'grocery',
                  queryType: 'topBrands',
                  shopType: 'grocery'
                })
              }}
            >
              <TextDefault H5 bolder textColor={currentTheme.main}>
                {t('SeeAll')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <View style={{ ...alignment.PRsmall }}>
            <FlatList
              data={sortRestaurantsByOpenStatus(groceryBrands || [])}
              renderItem={({ item }) => {
                const restaurantOpen = isOpen(item)
                return <NewRestaurantCard {...item} isOpen={restaurantOpen} />
              }}
              keyExtractor={(item) => item?._id}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              inverted={currentTheme?.isRTL ? true : false}
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default TopBrands
