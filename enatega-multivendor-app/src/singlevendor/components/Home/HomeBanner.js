import React from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import PromoBanner from '../Profile/PromoBanner'
import { verticalScale } from '../../../utils/scaling'

const { width } = Dimensions.get('window')

const HomeBanner = ({ banners = [], onBannerPress, autoplay = true, autoplayDelay = 3 }) => {
  const defaultBanners = [
    {
      id: '1',
      image: 'https://cdn.pixabay.com/photo/2025/08/26/00/35/tiger-9797048_1280.png'
    },
    {
      id: '2',
      image: 'https://cdn.pixabay.com/photo/2025/08/25/23/23/tree-9797010_1280.png'
    },
    {
      id: '3',
      image: 'https://cdn.pixabay.com/photo/2024/10/18/05/31/ai-generated-9129418_1280.jpg'
    }
  ]

  const bannersToDisplay = banners.length > 0 ? banners : defaultBanners

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
