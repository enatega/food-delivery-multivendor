import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import PromoBanner from '../Profile/PromoBanner'
import { verticalScale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const HomeBanner = ({ banners = [], onBannerPress, autoplay = true, autoplayDelay = 3 }) => {

  const navigation = useNavigation()
  const defaultBanners = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=300&fit=crop',
      title: 'New Arrival',
      description: '50% Off Special offer'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop',
      title: 'Summer Sale',
      description: 'Up to 70% Off'
    },
  ]

  console.log("default banners:", banners)

  const transformedBanners = banners.map(banner => ({
    id: banner._id,
    image: banner.file,
    title: banner.title,
    description: banner.description,
    action: banner.action,
    screen: banner.screen,
    parameters: banner.parameters,
    buttonText: banner.buttonText,
  }))

  console.log("my transform banner :", transformedBanners)

  const bannersToDisplay = transformedBanners.length > 0 ? transformedBanners : defaultBanners

  const handleBannerPress = (banner) => {

    console.log('Banner pressed:', banner)
    console.log('Screen value:', banner?.screen)

    if (!navigation) return

    console.log("Navigating to:", banner.screen)
    switch (banner.screen) {
      case 'Category':
        navigation.navigate('ProductExplorer')
        break

      case 'Product':
        navigation.navigate('ProductExplorer')
        break

      case 'Restaurant':
        navigation.navigate('ProductExplorer')
        break

      default:
        // fallback (normal navigation)
        if (banner.screen) {
          navigation.navigate(banner.screen, banner.parameters || {})
        }
        break
    }

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

    // Rest are image banners with overlay
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleBannerPress(item)}
        style={styles.bannerContainer}
      >
        <View style={styles.imageBannerWrapper}>
          {/* Background Image */}
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

          {/* Text Overlay - This is positioned absolutely over the image */}
          <View style={styles.textOverlay}>
            {/* Left Side - Title, Description, Button */}
            <View style={styles.textContent}>
              {item.title && (


                <Text style={styles.titleText} numberOfLines={2}>
                  {item.title}
                </Text>

              )}

              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleBannerPress(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.detailButtonText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

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
    paddingHorizontal: 16,
    position: 'relative'
  },
  bannerImage: {
    width: '100%',
    height: verticalScale(140),
    borderRadius: 16
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textContent: {
    flex: 1,
    justifyContent: 'space-between', // Changed to space-between
    paddingRight: 10,
    maxWidth: '50%',
    height: '100%' // Added to fill the full height
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  detailButton: {
    backgroundColor: '#0891B2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  dealFastContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 10
  },
  dealText: {
    fontSize: 40,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    lineHeight: 42
  },
  fastText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 46,
    marginTop: -8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
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