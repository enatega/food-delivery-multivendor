import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppState, Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import { normalizeSingleVendorMediaUrl } from '../../../utils/mediaUrl'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import VideoBanner from '../../../components/Main/Banner/VideoBanner'
import { DISCOVERY_GUTTER, getBannerLayout } from './discoveryLayout'
import { useOpenProductExplorer } from '../../utils/productExplorerPrefetch'

const VIDEO_EXTENSIONS = new Set(['mp4', 'm4v', 'mov', 'webm'])
const EXPLORER_SCREENS = new Set(['Category', 'Product', 'Restaurant'])
const DOT_SIZE = scale(6)
const DOT_ACTIVE_WIDTH = scale(20)

const isVideoUrl = (url) => {
  if (typeof url !== 'string') return false
  const path = url.split(/[?#]/, 1)[0]
  return VIDEO_EXTENSIONS.has(path.split('.').pop()?.toLowerCase())
}

const toBanner = (banner, resolveMedia) => {
  const media = typeof banner.file === 'string' ? resolveMedia(banner.file) : banner.file
  return {
    id: banner._id,
    raw: banner,
    media,
    isVideo: isVideoUrl(banner.file),
    title: banner.title,
    description: banner.description,
    screen: banner.screen,
    parameters: banner.parameters,
    buttonText: banner.buttonText
  }
}

const PaginationDot = memo(function PaginationDot({ index, progress, activeColor, inactiveColor }) {
  const animatedStyle = useAnimatedStyle(() => {
    const focus = Math.max(0, 1 - Math.abs(progress.value - index))
    return {
      width: DOT_SIZE + (DOT_ACTIVE_WIDTH - DOT_SIZE) * focus,
      backgroundColor: interpolateColor(focus, [0, 1], [inactiveColor, activeColor])
    }
  })

  return <Animated.View style={[styles.dot, animatedStyle]} />
})

const BannerCard = memo(function BannerCard({ item, width, height, marginEnd, isActive, isNear, isRTL, ctaLabel, onPress }) {
  const hasCopy = !!(item.title || item.description)

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={item.title || ctaLabel}
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        { width, height, marginEnd },
        pressed && styles.cardPressed
      ]}
    >
      {item.isVideo
        ? isNear && (
          <VideoBanner source={item.media} shouldPlay={isActive} style={styles.fill} />
        )
        : (
          <Image
            source={typeof item.media === 'string' ? { uri: item.media } : item.media}
            style={styles.fill}
            resizeMode='cover'
            fadeDuration={180}
          />
          )}

      <LinearGradient
        pointerEvents='none'
        colors={hasCopy ? SCRIM_STRONG : SCRIM_SOFT}
        locations={[0, 0.5, 1]}
        start={{ x: isRTL ? 1 : 0, y: 1 }}
        end={{ x: isRTL ? 0.15 : 0.85, y: 0.1 }}
        style={styles.fill}
      />

      <View style={styles.content} pointerEvents='none'>
        {!!item.title && (
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        )}
        {!!item.description && (
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        )}
        <View style={[styles.cta, hasCopy && styles.ctaSpaced]}>
          <Text style={styles.ctaText} numberOfLines={1}>
            {item.buttonText || ctaLabel}
          </Text>
          <Feather
            name={isRTL ? 'arrow-left' : 'arrow-right'}
            size={scale(13)}
            color={ON_BRAND}
          />
        </View>
      </View>

      <View pointerEvents='none' style={styles.innerStroke} />
    </Pressable>
  )
})

// `onPress` replaces the built-in single-vendor routing (multivendor banners
// carry their own action/screen contract); `resolveMedia` maps stored file
// paths to absolute URLs for the active backend.
const HomeBanner = ({
  banners = [],
  onBannerPress,
  onPress,
  resolveMedia = normalizeSingleVendorMediaUrl,
  autoplay = true,
  autoplayDelay = 4.5
}) => {
  const navigation = useNavigation()
  const openProductExplorer = useOpenProductExplorer()
  const isFocused = useIsFocused()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const isRTL = i18n.dir() === 'rtl'
  const { width: screenWidth } = useWindowDimensions()

  const items = useMemo(() => banners.map((banner) => toBanner(banner, resolveMedia)), [banners, resolveMedia])
  const count = items.length
  const { cardWidth, cardHeight, gap, interval } = useMemo(
    () => getBannerLayout(screenWidth, count),
    [screenWidth, count]
  )

  const listRef = useRef(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [appActive, setAppActive] = useState(AppState.currentState === 'active')

  const progress = useSharedValue(0)
  const lastIndex = useSharedValue(0)
  const intervalValue = useSharedValue(interval)
  const maxIndex = useSharedValue(Math.max(0, count - 1))

  useEffect(() => {
    intervalValue.value = interval
    maxIndex.value = Math.max(0, count - 1)
  }, [interval, count])

  const updateActiveIndex = useCallback((index) => {
    activeIndexRef.current = index
    setActiveIndex(index)
  }, [])

  // Scroll tracking runs on the UI thread; JS is only notified when the
  // visible slide actually changes.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const position = event.contentOffset.x / intervalValue.value
      progress.value = position
      const index = Math.min(maxIndex.value, Math.max(0, Math.round(position)))
      if (index !== lastIndex.value) {
        lastIndex.value = index
        runOnJS(updateActiveIndex)(index)
      }
    },
    onBeginDrag: () => {
      runOnJS(setIsDragging)(true)
    },
    onEndDrag: () => {
      runOnJS(setIsDragging)(false)
    }
  })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setAppActive(state === 'active'))
    return () => subscription.remove()
  }, [])

  // Autoplay only while the carousel is actually visible and idle; a tab
  // left mounted in the background no longer keeps scrolling and rendering.
  useEffect(() => {
    if (!autoplay || count < 2 || !isFocused || !appActive || isDragging) return

    const timer = setInterval(() => {
      const next = (activeIndexRef.current + 1) % count
      listRef.current?.scrollToOffset({ offset: next * interval, animated: true })
    }, autoplayDelay * 1000)

    return () => clearInterval(timer)
  }, [autoplay, autoplayDelay, count, interval, isFocused, appActive, isDragging])

  const handleBannerPress = useCallback((banner) => {
    if (onPress) {
      onPress(banner.raw)
      return
    }
    if (EXPLORER_SCREENS.has(banner.screen)) {
      openProductExplorer()
    } else if (banner.screen) {
      navigation.navigate(banner.screen, banner.parameters || {})
    }
    onBannerPress?.(banner)
  }, [navigation, onBannerPress, onPress, openProductExplorer])

  const ctaLabel = t('View offer', { defaultValue: 'View offer' })

  const renderItem = useCallback(({ item, index }) => (
    <BannerCard
      item={item}
      width={cardWidth}
      height={cardHeight}
      marginEnd={index === count - 1 ? 0 : gap}
      isActive={isFocused && index === activeIndex}
      isNear={Math.abs(index - activeIndex) <= 1}
      isRTL={isRTL}
      ctaLabel={ctaLabel}
      onPress={handleBannerPress}
    />
  ), [cardWidth, cardHeight, gap, count, isFocused, activeIndex, isRTL, ctaLabel, handleBannerPress])

  const getItemLayout = useCallback(
    (_, index) => ({ length: interval, offset: interval * index, index }),
    [interval]
  )

  if (!count) return null

  const inactiveDotColor = themeContext.ThemeValue === 'Dark' ? '#3F3F46' : '#D4D4D8'

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={items}
        horizontal
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderItem}
        extraData={activeIndex}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        snapToAlignment='start'
        decelerationRate='fast'
        disableIntervalMomentum
        scrollEnabled={count > 1}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.listContent}
      />

      {count > 1 && (
        <View style={styles.pagination} pointerEvents='none'>
          {items.map((item, index) => (
            <PaginationDot
              key={String(item.id ?? index)}
              index={index}
              progress={progress}
              activeColor={currentTheme.singleVendorBrand}
              inactiveColor={inactiveDotColor}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const ON_BRAND = theme.Pink.singleVendorOnBrand
const SCRIM_STRONG = ['rgba(6, 12, 5, 0.82)', 'rgba(6, 12, 5, 0.42)', 'rgba(6, 12, 5, 0)']
const SCRIM_SOFT = ['rgba(6, 12, 5, 0.45)', 'rgba(6, 12, 5, 0.12)', 'rgba(6, 12, 5, 0)']

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(4)
  },
  listContent: {
    paddingHorizontal: DISCOVERY_GUTTER
  },
  card: {
    borderRadius: scale(20),
    overflow: 'hidden',
    backgroundColor: '#1A2416',
    justifyContent: 'flex-end'
  },
  cardPressed: {
    transform: [{ scale: 0.985 }]
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0
  },
  content: {
    padding: scale(16),
    maxWidth: '78%',
    alignItems: 'flex-start'
  },
  title: {
    color: '#FFFFFF',
    fontSize: scale(19),
    lineHeight: scale(23),
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'left'
  },
  description: {
    marginTop: scale(3),
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '500',
    textAlign: 'left'
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: theme.Pink.singleVendorBrand,
    paddingVertical: scale(7),
    paddingHorizontal: scale(13),
    borderRadius: 999
  },
  ctaSpaced: {
    marginTop: scale(11)
  },
  ctaText: {
    color: ON_BRAND,
    fontSize: scale(12),
    fontWeight: '700',
    letterSpacing: 0.1
  },
  innerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.16)'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(5),
    marginTop: scale(10)
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2
  }
})

export default HomeBanner
