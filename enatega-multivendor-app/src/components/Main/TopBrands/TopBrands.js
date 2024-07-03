import React, { useContext } from 'react'
import { View, FlatList, Text, Image } from 'react-native'
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

function TopBrands(props) {
  const { t } = useTranslation()
  const { location } = useContext(LocationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()

  const { loading, error, data } = useQuery(topRatedVendorsInfo, {
    variables: {
      latitude: location?.latitude,
      longitude: location?.longitude
    }
  })
  // console.log('GROCERY => ', data?.topRatedVendors?.filter((item)=>item.shopType === 'grocery')?.length)
  // console.log('RESTAURANTS => ', data?.topRatedVendors?.filter((item)=>item.shopType === 'restaurant')?.length)

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles().topbrandsContainer}
      onPress={() => navigation.navigate('Restaurant', { ...item })}
    >
      <View style={styles().brandImgContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles().brandImg}
          resizeMode='contain'
        />
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <TextDefault
          style={styles().brandName}
          textColor={currentTheme.fontThirdColor}
          H5
          bolder
        >
          {item?.name}
        </TextDefault>
        <TextDefault textColor={currentTheme.fontFifthColor} normal>
          {item?.deliveryTime} mins
        </TextDefault>
      </View>
    </TouchableOpacity>
  )

  if (loading) return <TopBrandsLoadingUI />
  if (error) return <Text style={styles().margin}>Error: {error.message}</Text>

  const brandsData = {
    restaurant: [],
    grocery: [],
  };

  data?.topRatedVendorsPreview?.forEach((item) => {
      brandsData[item.shopType].push(item);
  });


  return (
    <View style={styles().mainContainer}>
      <View style={styles().topbrandsSec}>
        <View style={styles().header}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H4
          >
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
          />
        </View>
      </View>
      <View style={styles().topbrandsSec}>
        <View style={styles().header}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H4
          >
            {t('Top Restaurant Brands')}
          </TextDefault>
          <TouchableOpacity
            style={styles(currentTheme).seeAllBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Menu', {
                selectedType: 'restaurant',
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
            data={brandsData.restaurant}
            renderItem={({ item }) => {
              return <NewRestaurantCard {...item} />
            }}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        </View>
      </View>

      <View style={styles().topbrandsSec}>
        <View style={styles().header}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H4
          >
            {t('Top Grocery Brands')}
          </TextDefault>
          <TouchableOpacity
            style={styles(currentTheme).seeAllBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Menu', {
                selectedType: 'grocery',
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
            data={brandsData.grocery}
            renderItem={({ item }) => {
              return <NewRestaurantCard {...item} />
            }}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        </View>
      </View>
    </View>
  )
}

export default TopBrands
