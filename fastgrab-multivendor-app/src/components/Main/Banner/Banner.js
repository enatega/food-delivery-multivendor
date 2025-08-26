import React, { useContext } from 'react'
import { View, ImageBackground, TouchableOpacity, Dimensions, Image } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { useNavigation } from '@react-navigation/native'
import VideoBanner from './VideoBanner'
import { BANNER_PARAMETERS } from '../../../utils/banner-routes'
import { scale } from '../../../utils/scaling'

// Helper function to get media type from URL
const getMediaTypeFromUrl = (url) => {
  const extension = url?.split('.').pop().toLowerCase()
  const videoExtensions = ['mp4']
  return videoExtensions.includes(extension) ? 'video' : 'image'
}

const Banner = ({ banners }) => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { width } = Dimensions.get('window')

  const onPressBanner = (banner) => {
    let _selectedType = ''
    let _queryType = ''
    let parameters = null
    const action = banner.action
    if (banner?.parameters) {
      parameters = JSON.parse(banner.parameters)
      _selectedType = parameters[0]?.value
      _queryType = parameters[1]?.value
    }

    if (action === 'Navigate Specific Restaurant') {
      navigation.navigate('Restaurant', {
        _id: banner.screen
      })
    } else {
      /* 
      
         navigation?.getState()?.routeNames?.includes(banner.screen)
          ? banner.screen
          : name,
          
      */

      const { name, selectedType, queryType } = BANNER_PARAMETERS[banner?.screen]
      navigation.navigate(name, {
        // Pass navigation parameters
        selectedType: selectedType ?? 'restaurant', // Use selectedType if provided, otherwise default to 'restaurant'
        queryType: queryType ?? 'restaurant' // Use queryType if provided, otherwise default to 'restaurant'
      })
    }
  }

  const renderBannerContent = (item) => (
    <View style={styles().container}>
      <TextDefault H3 bolder textColor='#fff' style={{ textTransform: 'capitalize', marginHorizontal: scale(5) }}>
        {item?.title}
      </TextDefault>
      <TextDefault bolder textColor='#fff' style={{ marginHorizontal: scale(5), marginBottom: scale(5) }}>
        {item?.description}
      </TextDefault>
    </View>
  )

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      removeClippedSubviews={true}
      windowSize={3}
      showPagination
      data={banners ?? []}
      snapToInterval={width} // Ensures only one image is visible at a time
      snapToAlignment='center'
      paginationStyle={styles().pagination}
      paginationActiveColor={currentTheme.main}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={styles().paginationItem}
      paginationStyleItemInactive={styles().paginationItem}
      renderItem={({ item }) => {
        const mediaType = getMediaTypeFromUrl(item.file)

        return (
          <TouchableOpacity
            style={[styles(currentTheme).banner, { width }]}
            activeOpacity={0.9}
            onPress={() => {
              onPressBanner(item)
            }}
          >
            {mediaType === 'video' ? (
              <VideoBanner style={styles().image} source={{ uri: item?.file }}>
                {renderBannerContent(item)}
              </VideoBanner>
            ) : (
              <View style={styles().csd}>
                <ImageBackground source={{ uri: item?.file }} style={styles().imgs1} resizeMode='cover'>
                  {renderBannerContent(item)}
                </ImageBackground>
              </View>
            )}
          </TouchableOpacity>
        )
      }}
    />
  )
}

export default Banner
