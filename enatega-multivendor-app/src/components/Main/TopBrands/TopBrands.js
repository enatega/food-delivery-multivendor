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
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import TopBrandsLoadingUI from '../LoadingUI/TopBrandsLoadingUI'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'

const TOP_BRANDS = gql`
  ${topRatedVendorsInfo}
`

function TopBrands(props) {
  const { t } = useTranslation()
  const { location } = useContext(LocationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()

  const { loading, error, data } = useQuery(TOP_BRANDS, {
    variables: {
      latitude: location?.latitude,
      longitude: location?.longitude
    }
  })
  // console.log('GROCERY => ', data?.topRatedVendors?.filter((item)=>item.shopType === 'grocery')?.length)
  // console.log('RESTAURANTS => ', data?.topRatedVendors?.filter((item)=>item.shopType === 'restaurant')?.length)

  const renderItem = ({ item }) => (
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
          {item?.deliveryTime} + {t('mins')}
        </TextDefault>
      </View>
    </TouchableOpacity>
  )

  if (loading) return <TopBrandsLoadingUI />
  if (error) return <Text style={styles().margin}>Error: {error.message}</Text>

  return (
    <View style={styles().mainContainer}>
    <View style={styles().topbrandsSec}>
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontFourthColor}
        bolder
        H4
      >
        {t('topBrands')}
      </TextDefault>
      <View style={{ ...alignment.PRsmall }}>
        <FlatList
          data={data?.topRatedVendors}
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
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontFourthColor}
        bolder
        H4
      >
        Top Restaurant Brands
      </TextDefault>
      <View style={{ ...alignment.PRsmall }}>
        <FlatList
          data={data?.topRatedVendors?.filter((item)=>item.shopType === 'restaurant')}
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
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontFourthColor}
        bolder
        H4
      >
        Top Grocery Brands
      </TextDefault>
      <View style={{ ...alignment.PRsmall }}>
        <FlatList
          data={data?.topRatedVendors?.filter((item)=>item.shopType === 'grocery')}
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
