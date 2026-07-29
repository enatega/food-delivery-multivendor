import React, { useContext, useMemo, useState, useCallback } from 'react'
import { View, ImageBackground, TouchableOpacity, Dimensions, AppState, InteractionManager } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import VideoBanner from './VideoBanner'
import { BANNER_PARAMETERS } from '../../../utils/banner-routes'
import { scale } from '../../../utils/scaling'
import { getCachedMediaUri, useCachedMediaUri } from '../../../utils/mediaCache'

// Helper function to get media type from URL
const getMediaTypeFromUrl = (url) => {
  const extension = url?.split('.').pop().toLowerCase()
  const videoExtensions = ['mp4']
  return videoExtensions.includes(extension) ? 'video' : 'image'
}

// Stable empty object so slides without cached media keep referential equality
// across renders (otherwise `|| {}` would break React.memo on every render).
const EMPTY_CACHE = {}
const PRIORITY_BANNER_COUNT = 2

const BannerContent = ({ item, currentTheme }) => (
  <View style={styles(currentTheme).container}>
    <TextDefault H2 bolder textColor='#fff' style={{ textTransform: 'capitalize', marginHorizontal: scale(15), marginBottom: scale(8) }}>
      {item?.title}
    </TextDefault>
    <TextDefault H5 bold textColor='#fff' style={{ marginHorizontal: scale(15), marginBottom: scale(15), opacity: 0.95 }}>
      {item?.description}
    </TextDefault>
  </View>
)

// Each slide is memoized so an autoplay index change only re-renders the two
// slides whose `isActiveSlide` flips — not every mounted ImageBackground/video.
const BannerSlide = React.memo(function BannerSlide({ item, width, cached, isActiveSlide, currentTheme, onPress }) {
  const mediaType = getMediaTypeFromUrl(item.file)
  const isVideoBanner = mediaType === 'video'
  const fallbackImage = cached.image || item?.image || item?.thumbnail || item?.previewImage || (mediaType !== 'video' ? item?.file : null)
  const imageUri = useCachedMediaUri(fallbackImage, 'image')
  const videoUri = cached.video || item?.file

  return (
    <TouchableOpacity style={[styles(currentTheme).banner, { width }]} activeOpacity={0.9} onPress={() => onPress(item)}>
      {isVideoBanner
        ? (
        <VideoBanner style={styles(currentTheme).image} posterUri={imageUri} shouldPlay={isActiveSlide} source={videoUri}>
          <BannerContent item={item} currentTheme={currentTheme} />
        </VideoBanner>
          )
        : (
        <View style={styles(currentTheme).csd}>
          {imageUri
            ? (
            <ImageBackground source={{ uri: imageUri }} style={styles(currentTheme).imgs1} resizeMode='cover'>
              <BannerContent item={item} currentTheme={currentTheme} />
            </ImageBackground>
              )
            : (
            <View style={[styles(currentTheme).imgs1, { backgroundColor: '#1f2937' }]}>
              <BannerContent item={item} currentTheme={currentTheme} />
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
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active')
  const [cachedMediaMap, setCachedMediaMap] = useState({})

  const onPressBanner = useCallback(
    (banner) => {
      const action = banner.action

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
    },
    [navigation]
  )

  const bannersData = useMemo(() => {
    const list = banners ?? []
    return list
  }, [banners])
  const slideStyles = useMemo(() => styles(currentTheme), [currentTheme])

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => setIsFocused(false)
    }, [])
  )

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setIsAppActive(nextState === 'active')
    })

    return () => subscription.remove()
  }, [])

  React.useEffect(() => {
    let isMounted = true
    const list = bannersData || []

    const resolveCacheEntry = async(banner) => {
      const mediaUrl = banner?.file
      const mediaType = getMediaTypeFromUrl(mediaUrl)
      const imageUrl = banner?.image || banner?.thumbnail || banner?.previewImage || (mediaType !== 'video' ? mediaUrl : null)
      const cacheValue = {}

      if (imageUrl) {
        cacheValue.image = await getCachedMediaUri(imageUrl, 'image')
      }
      if (mediaUrl && mediaType === 'video') {
        cacheValue.video = await getCachedMediaUri(mediaUrl, 'video')
      }

      return [banner?._id || mediaUrl, cacheValue]
    }

    const hydrateCacheBatch = async(batch) => {
      if (!batch.length) return
      const entries = await Promise.all(batch.map(resolveCacheEntry))
      if (!isMounted) return
      setCachedMediaMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    }

    hydrateCacheBatch(list.slice(0, PRIORITY_BANNER_COUNT))

    const interactionTask = InteractionManager.runAfterInteractions(() => {
      hydrateCacheBatch(list.slice(PRIORITY_BANNER_COUNT))
    })

    return () => {
      isMounted = false
      interactionTask?.cancel?.()
    }
  }, [bannersData])

  const renderItem = useCallback(
    ({ item, index }) => {
      const cacheKey = item?._id || item?.file
      return <BannerSlide item={item} width={width} cached={cachedMediaMap[cacheKey] || EMPTY_CACHE} isActiveSlide={index === activeIndex && isFocused && isAppActive} currentTheme={currentTheme} onPress={onPressBanner} />
    },
    [width, cachedMediaMap, activeIndex, isFocused, isAppActive, currentTheme, onPressBanner]
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
      initialNumToRender={PRIORITY_BANNER_COUNT}
      maxToRenderPerBatch={PRIORITY_BANNER_COUNT}
      updateCellsBatchingPeriod={16}
      removeClippedSubviews
      windowSize={3}
      showPagination
      data={bannersData}
      keyExtractor={(item, index) => item?._id || item?.file || String(index)}
      snapToInterval={width} // Ensures only one image is visible at a time
      snapToAlignment='center'
      paginationStyle={slideStyles.pagination}
      paginationActiveColor={currentTheme.main}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={slideStyles.paginationItem}
      paginationStyleItemInactive={slideStyles.paginationItem}
      onChangeIndex={onChangeIndex}
      renderItem={renderItem}
    />
  )
}

export default React.memo(Banner)
