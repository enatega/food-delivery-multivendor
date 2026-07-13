import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { verticalScale } from '../../../utils/scaling'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const isTablet = Math.min(screenWidth, screenHeight) >= 768

const HomeBanner = ({ banners = [], onBannerPress, autoplay = true, autoplayDelay = 3 }) => {
  const s = styles(isTablet)
  const navigation = useNavigation()

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

  const bannersToDisplay = transformedBanners

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


  const renderBanner = ({ item }) => {
    return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleBannerPress(item)}
          style={s.bannerContainer}
        >
        <View style={s.imageBannerWrapper}>
          {/* Background Image with Content Overlay */}
          <ImageBackground
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={s.bannerImage}
            imageStyle={s.bannerImageStyle}
            resizeMode="cover"
            onError={(error) => {
              console.log('❌ Image load error for banner:', item.id, error.nativeEvent.error)
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully for banner:', item.id)
            }}
          >
            {/* Text Content - Now inside ImageBackground without absolute positioning */}
            <View style={s.textOverlay}>
              {/* Left Side - Title, Description, Button */}
              <View style={s.textContent}>
                {item.title && (
                  <Text style={s.titleText} numberOfLines={2}>
                    {item.title}
                  </Text>
                )}

                <TouchableOpacity
                  style={s.detailButton}
                  onPress={() => handleBannerPress(item)}
                  activeOpacity={0.8}
                >
                  <Text style={s.detailButtonText}>{item.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    )
  }

  if (!bannersToDisplay.length) {
    return null
  }

  return (
    <View style={s.container}>
      <SwiperFlatList
        autoplay={autoplay}
        autoplayDelay={autoplayDelay}
        autoplayLoop
        index={0}
        showPagination={bannersToDisplay.length > 1}
        data={bannersToDisplay}
        renderItem={renderBanner}
        paginationStyle={s.pagination}
        paginationStyleItem={s.paginationDot}
        paginationStyleItemActive={s.paginationDotActive}
        paginationStyleItemInactive={s.paginationDotInactive}
      />
    </View>
  )
}

const styles = (tablet = false) => StyleSheet.create({
  container: {
    marginBottom: tablet ? verticalScale(30) : 16
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
    borderRadius: 16,
    overflow: 'hidden'
  },
  bannerImageStyle: {
    borderRadius: 16
  },
  textOverlay: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: '100%'
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
    bottom: tablet ? -verticalScale(24) : -10
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
