import React from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import PromoBanner from '../Profile/PromoBanner'
import { verticalScale } from '../../../utils/scaling'

const { width } = Dimensions.get('window')

/**
 * HomeBanner Component functionalities for better visibility. 
 * 
 *  Displays a banner slider with PromoBanner as the first slide,
 *  followed by banners from the backend (or default placeholders).
 *  onBannerPress - Callback when a banner is pressed
 *  autoplay - Enable/disable autoplay (default: true)
 *  autoplayDelay - Delay between slides in seconds (default: 3)
 */

const HomeBanner = ({ banners = [], onBannerPress, autoplay = true, autoplayDelay = 3 }) => {
  const defaultBanners = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=300&fit=crop'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop'
    },
  ]

  // Transform backend banners to match our format
  const transformedBanners = banners.map(banner => ({
    id: banner._id,
    image: banner.file,
    title: banner.title,
    description: banner.description,
    action: banner.action,
    screen: banner.screen,
    parameters: banner.parameters
  }))

  const bannersToDisplay = transformedBanners.length > 0 ? transformedBanners : defaultBanners

  const handleBannerPress = (banner) => {
    if (onBannerPress) {
      onBannerPress(banner)
    }
  }

  const renderBanner = ({ item, index }) => {
    // First slide is PromoBanner
    if (index === 0) {
      return (
        <View style={styles.bannerContainer}>
          <PromoBanner />
        </View>
      )
    }

    // Rest are image banners
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleBannerPress(item)}
        style={styles.bannerContainer}
      >
        <View style={styles.imageBannerWrapper}>
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={styles.bannerImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('❌ Image load error for banner:', item.id, error.nativeEvent.error)
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully for banner:', item.id)
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  // Combine PromoBanner placeholder with actual banners
  const allBanners = [{ id: 'promo', isPromo: true }, ...bannersToDisplay]

  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay={autoplay}
        autoplayDelay={autoplayDelay}
        autoplayLoop
        index={0}
        showPagination
        data={allBanners}
        renderItem={renderBanner}
        paginationStyle={styles.pagination}
        paginationStyleItem={styles.paginationDot}
        paginationStyleItemActive={styles.paginationDotActive}
        paginationStyleItemInactive={styles.paginationDotInactive}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  bannerContainer: {
    width: width
  },
  imageBannerWrapper: {
    paddingHorizontal: 16
  },
  bannerImage: {
    width: '100%',
    height: verticalScale(140),
    borderRadius: 16
  },
  pagination: {
    bottom: -10
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  paginationDotActive: {
    backgroundColor: '#006189',
    width: 24
  },
  paginationDotInactive: {
    backgroundColor: '#D1D5DB'
  }
})

export default HomeBanner
