import React, { useContext, useMemo, useState, useCallback } from 'react'
import { View, ImageBackground, TouchableOpacity, Dimensions, Platform } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import VideoBanner from './VideoBanner'
import { BANNER_PARAMETERS } from '../../../utils/banner-routes'
import { scale } from '../../../utils/scaling'
import { getCachedMediaUri } from '../../../utils/mediaCache'

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(true)
  const [cachedMediaMap, setCachedMediaMap] = useState({})

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

  const bannersData = useMemo(() => {
    const list = banners ?? []
    return list
  }, [banners])

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => setIsFocused(false)
    }, [])
  )

  React.useEffect(() => {
    let isMounted = true
    ;(async () => {
      const list = bannersData || []
      const entries = await Promise.all(
        list.map(async (banner) => {
          const mediaUrl = banner?.file
          const imageUrl = banner?.image || banner?.thumbnail || banner?.previewImage
          const mediaType = getMediaTypeFromUrl(mediaUrl)
          const cacheValue = {}

          if (mediaUrl && mediaType === 'video') {
            cacheValue.video = await getCachedMediaUri(mediaUrl, 'video')
          }
          if (imageUrl) {
            cacheValue.image = await getCachedMediaUri(imageUrl, 'image')
          } else if (mediaUrl && mediaType !== 'video') {
            cacheValue.image = await getCachedMediaUri(mediaUrl, 'image')
          }

          return [banner?._id || mediaUrl, cacheValue]
        })
      )

      if (isMounted) {
        setCachedMediaMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
      }
    })()

    return () => {
      isMounted = false
    }
  }, [bannersData])

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
      data={bannersData}
      snapToInterval={width} // Ensures only one image is visible at a time
      snapToAlignment='center'
      paginationStyle={styles().pagination}
      paginationActiveColor={currentTheme.main}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={styles().paginationItem}
      paginationStyleItemInactive={styles().paginationItem}
      onChangeIndex={({ index }) => setActiveIndex(index)}
      renderItem={({ item, index }) => {
        const mediaType = getMediaTypeFromUrl(item.file)
        const cacheKey = item?._id || item?.file
        const cached = cachedMediaMap[cacheKey] || {}
        const isActiveSlide = index === activeIndex && isFocused
        const shouldRenderVideo = mediaType === 'video' && (!Platform.OS || Platform.OS !== 'android' || isActiveSlide)
        const fallbackImage = cached.image || item?.image || item?.thumbnail || item?.previewImage
        const videoUri = cached.video || item?.file

        return (
          <TouchableOpacity
            style={[styles(currentTheme).banner, { width }]}
            activeOpacity={0.9}
            onPress={() => {
              onPressBanner(item)
            }}
          >
            {shouldRenderVideo ? (
              <VideoBanner style={styles().image} source={videoUri}>
                {renderBannerContent(item)}
              </VideoBanner>
            ) : (
              <View style={styles().csd}>
                {fallbackImage ? (
                  <ImageBackground source={{ uri: fallbackImage }} style={styles().imgs1} resizeMode='cover'>
                    {renderBannerContent(item)}
                  </ImageBackground>
                ) : (
                  <View style={[styles().imgs1, { backgroundColor: '#1f2937' }]}>
                    {renderBannerContent(item)}
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        )
      }}
    />
  )
}

export default Banner
