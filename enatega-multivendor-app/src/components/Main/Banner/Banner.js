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

// Stable empty object so slides without cached media keep referential equality
// across renders (otherwise `|| {}` would break React.memo on every render).
const EMPTY_CACHE = {}

const BannerContent = ({ item }) => (
  <View style={styles().container}>
    <TextDefault H3 bolder textColor='#fff' style={{ textTransform: 'capitalize', marginHorizontal: scale(5) }}>
      {item?.title}
    </TextDefault>
    <TextDefault bolder textColor='#fff' style={{ marginHorizontal: scale(5), marginBottom: scale(5) }}>
      {item?.description}
    </TextDefault>
  </View>
)

// Each slide is memoized so an autoplay index change only re-renders the two
// slides whose `isActiveSlide` flips — not every mounted ImageBackground/video.
const BannerSlide = React.memo(function BannerSlide({ item, width, cached, isActiveSlide, currentTheme, onPress }) {
  const mediaType = getMediaTypeFromUrl(item.file)
  const shouldRenderVideo = mediaType === 'video' && (!Platform.OS || Platform.OS !== 'android' || isActiveSlide)
  const fallbackImage = cached.image || item?.image || item?.thumbnail || item?.previewImage
  const videoUri = cached.video || item?.file

  return (
    <TouchableOpacity style={[styles(currentTheme).banner, { width }]} activeOpacity={0.9} onPress={() => onPress(item)}>
      {shouldRenderVideo ? (
        <VideoBanner style={styles().image} source={videoUri}>
          <BannerContent item={item} />
        </VideoBanner>
      ) : (
        <View style={styles().csd}>
          {fallbackImage ? (
            <ImageBackground source={{ uri: fallbackImage }} style={styles().imgs1} resizeMode='cover'>
              <BannerContent item={item} />
            </ImageBackground>
          ) : (
            <View style={[styles().imgs1, { backgroundColor: '#1f2937' }]}>
              <BannerContent item={item} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
})

const Banner = ({ banners }) => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { width } = Dimensions.get('window')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(true)
  const [cachedMediaMap, setCachedMediaMap] = useState({})

  const onPressBanner = useCallback((banner) => {
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
  }, [navigation])

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

  const renderItem = useCallback(
    ({ item, index }) => {
      const cacheKey = item?._id || item?.file
      return (
        <BannerSlide
          item={item}
          width={width}
          cached={cachedMediaMap[cacheKey] || EMPTY_CACHE}
          isActiveSlide={index === activeIndex && isFocused}
          currentTheme={currentTheme}
          onPress={onPressBanner}
        />
      )
    },
    [width, cachedMediaMap, activeIndex, isFocused, currentTheme, onPressBanner]
  )

  const onChangeIndex = useCallback(({ index }) => setActiveIndex(index), [])

  // Don't mount the autoplay slider until banners have actually loaded —
  // rendering it with an empty list reserves a blank strip on the discovery
  // page and makes the layout jump once data arrives.
  if (!bannersData || bannersData.length === 0) return null

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
      onChangeIndex={onChangeIndex}
      renderItem={renderItem}
    />
  )
}

export default React.memo(Banner)
