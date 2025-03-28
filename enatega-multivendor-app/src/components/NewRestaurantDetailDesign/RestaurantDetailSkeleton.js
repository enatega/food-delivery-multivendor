import React from 'react'
import { View, Animated, Easing } from 'react-native'
import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
import { StatusBar } from 'react-native'

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 44

const SkeletonPlaceholder = ({ style, duration = 1500, currentTheme }) => {
  const animatedOpacity = React.useRef(new Animated.Value(0.5)).current

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <Animated.View
      style={[
        {
          backgroundColor: currentTheme?.gray || '#B8B8B8',
          borderRadius: 4,
          opacity: animatedOpacity
        },
        style
      ]}
    />
  )
}

const RestaurantDetailSkeleton = ({ currentTheme }) => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={[styles.headerSkeleton, { backgroundColor: currentTheme.cardBackground }]}>
        {/* Main image */}
        <View style={styles.imageContainer}>
          <SkeletonPlaceholder
            currentTheme={currentTheme}
            style={{
              width: '100%', 
              height: scale(200)
            }}
          />
          
          {/* Header icons overlay */}
          <View style={styles.headerIconsContainer}>
            <View style={[styles.iconButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(17), height: scale(17), borderRadius: scale(8.5) }} />
            </View>

            <View style={{ flexDirection: 'row', gap: scale(8) }}>
              <View style={[styles.iconButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(17), height: scale(17), borderRadius: scale(8.5) }} />
              </View>
              <View style={[styles.iconButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(17), height: scale(17), borderRadius: scale(8.5) }} />
              </View>
            </View>
          </View>

          {/* Delivery details overlay */}
          <View style={styles.deliveryDetailsOverlay}>
            <View style={[styles.detailPill, { backgroundColor: currentTheme.themeBackground || 'white' }]}>
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: scale(120),
                  height: scale(16),
                  borderRadius: scale(3)
                }}
              />
            </View>

            <View style={[styles.detailPill, { backgroundColor: currentTheme.themeBackground || 'white' }]}>
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: scale(110),
                  height: scale(16),
                  borderRadius: scale(3)
                }}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Restaurant title and logo section */}
          <View style={styles.titleContainer}>
            <View style={styles.titleInner}>
              <View style={styles.logoContainer}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(50), height: scale(50), borderRadius: scale(8) }} />
              </View>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(180), height: scale(22), borderRadius: scale(4) }} />
            </View>
            <View style={[styles.favoriteButton, { backgroundColor: currentTheme.gray100 }]}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(24), height: scale(24), borderRadius: scale(12) }} />
            </View>
          </View>

          {/* Cuisine */}
          <View style={styles.cuisineContainer}>
            <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(200), height: scale(16), borderRadius: scale(3) }} />
            <View style={{ width: scale(25), height: scale(25), alignItems: 'center', justifyContent: 'center' }}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(15), height: scale(15), borderRadius: scale(2) }} />
            </View>
          </View>

          {/* Ratings section */}
          <View style={styles.infoContainer}>
            <View style={styles.ratingBox}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(20), height: scale(20), borderRadius: scale(10) }} />
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(25), height: scale(16), borderRadius: scale(3) }} />
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(80), height: scale(16), borderRadius: scale(3) }} />
            </View>
            <View style={[styles.reviewButton, { backgroundColor: currentTheme.newButtonBackground || '#F3FFEE' }]}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(80), height: scale(16), borderRadius: scale(3) }} />
            </View>
          </View>

          {/* Timing section */}
          <View style={styles.infoContainer}>
            <View style={styles.ratingBox}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(21), height: scale(21), borderRadius: scale(10.5) }} />
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(120), height: scale(16), borderRadius: scale(3) }} />
            </View>
            <View style={[styles.statusButton, { backgroundColor: currentTheme.newButtonBackground || '#F3FFEE' }]}>
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(50), height: scale(16), borderRadius: scale(3) }} />
            </View>
          </View>

          {/* Delivery time */}
          <View style={styles.deliveryContainer}>
            <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(24), height: scale(24), borderRadius: scale(12) }} />
            <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(70), height: scale(16), borderRadius: scale(3) }} />
          </View>
        </View>
      </View>

      {/* Popular Section Skeleton */}
      <View style={[styles.sectionSkeleton, { backgroundColor: currentTheme.themeBackground }]}>
        <View style={styles.sectionHeaderSkeleton}>
          <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(80), height: scale(22), borderRadius: scale(4) }} />
        </View>
        
        <View style={styles.popularItems}>
          {[1, 2, 3].map((item) => (
            <View 
              key={item} 
              style={[
                styles.popularItemSkeleton, 
                { backgroundColor: currentTheme.popularitemcard || currentTheme.cardBackground || '#FFFFFF' }
              ]}
            >
              {/* Plus button in actual position */}
              <View style={[
                styles.plusButtonSkeleton, 
                { backgroundColor: currentTheme.plusIcon || '#AAC810' }
              ]}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(16), height: scale(16), borderRadius: scale(8) }} />
              </View>
              
              {/* Image area */}
              <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: '100%', height: scale(100) }} />
              
              {/* Content area */}
              <View style={styles.itemDetails}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(60), height: scale(16), borderRadius: scale(3) }} />
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(80), height: scale(14), borderRadius: scale(3), marginTop: scale(4) }} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Categories Section Skeleton */}
      <View style={[styles.sectionSkeleton, { backgroundColor: currentTheme.themeBackground }]}>
        <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: scale(140), height: scale(22), borderRadius: scale(4), marginBottom: scale(15) }} />
        
        <View style={styles.categoriesGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              style={styles.categoryWrapper}
            >
              <View style={[
                styles.categoryItemSkeleton, 
                { backgroundColor: currentTheme.popularitemcard || currentTheme.cardBackground || '#FFFFFF' }
              ]}>
                <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: '100%', height: scale(100) }} />
                <View style={styles.categoryTitleContainer}>
                  <SkeletonPlaceholder currentTheme={currentTheme} style={{ width: '70%', height: scale(16), borderRadius: scale(3) }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerSkeleton: {
    width: '100%'
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    height: scale(200)
  },
  headerIconsContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + scale(10),
    left: 0,
    right: 0,
    paddingHorizontal: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  iconButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center'
  },
  deliveryDetailsOverlay: {
    position: 'absolute',
    bottom: scale(10),
    width: '100%',
    paddingHorizontal: scale(15),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: scale(5)
  },
  detailPill: {
    borderRadius: scale(20),
    paddingVertical: scale(5),
    paddingHorizontal: scale(15),
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  contentContainer: {
    padding: scale(15),
    gap: scale(12)
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  titleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1
  },
  logoContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(8),
    overflow: 'hidden'
  },
  favoriteButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  cuisineContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8)
  },
  reviewButton: {
    borderRadius: scale(4),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12)
  },
  statusButton: {
    borderRadius: scale(4),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12)
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8)
  },
  sectionSkeleton: {
    padding: scale(15),
    marginBottom: scale(25)
  },
  sectionHeaderSkeleton: {
    marginBottom: scale(15)
  },
  popularItems: {
    flexDirection: 'row',
    gap: scale(15)
  },
  popularItemSkeleton: {
    width: scale(140),
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative'
  },
  plusButtonSkeleton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  itemDetails: {
    padding: scale(10)
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -scale(5)
  },
  categoryWrapper: {
    width: '50%',
    padding: scale(5)
  },
  categoryItemSkeleton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  categoryTitleContainer: {
    padding: scale(12),
    alignItems: 'center'
  }
})

export default RestaurantDetailSkeleton