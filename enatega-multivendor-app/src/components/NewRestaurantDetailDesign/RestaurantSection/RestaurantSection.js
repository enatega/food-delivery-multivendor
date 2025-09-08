import React, { useState, useEffect, useRef } from 'react'
import { View, FlatList, TouchableOpacity, Alert, Animated, Easing } from 'react-native'
import { useRestaurantQueries } from '../../../ui/hooks/useRestaurantScreenNewDesign'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'
import ShimmerImage from '../../ShimmerImage/ShimmerImage'
import { useTranslation } from 'react-i18next'

const CARD_SPACING = scale(10)

// Skeleton Placeholder Component
const SkeletonPlaceholder = ({ style, currentTheme }) => {
  const animatedOpacity = React.useRef(new Animated.Value(0.5)).current

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 800,
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

// Skeleton for Popular Items
const PopularItemsSkeleton = ({ currentTheme }) => {
  return (
    <View style={styles(currentTheme).section}>
      <View style={styles(currentTheme).sectionHeader}>
        <SkeletonPlaceholder
          currentTheme={currentTheme}
          style={{
            width: scale(80),
            height: scale(22),
            borderRadius: scale(4)
          }}
        />
      </View>

      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={() => (
          <View style={styles(currentTheme).popularItemCard}>
            {/* Plus button skeleton */}
            <View style={styles(currentTheme).plusButton}>
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: scale(24),
                  height: scale(24),
                  borderRadius: scale(12)
                }}
              />
            </View>

            <SkeletonPlaceholder
              currentTheme={currentTheme}
              style={{
                width: '100%',
                height: scale(100),
                borderTopLeftRadius: scale(16),
                borderTopRightRadius: scale(16)
              }}
            />
            <View style={styles(currentTheme).popularItemInfo}>
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: scale(60),
                  height: scale(16),
                  borderRadius: scale(3),
                  marginBottom: scale(4)
                }}
              />
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: scale(80),
                  height: scale(14),
                  borderRadius: scale(3)
                }}
              />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => 'popular-skeleton-' + index}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).popularList}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
      />
    </View>
  )
}

// Skeleton for Categories
const CategoriesSkeleton = ({ currentTheme }) => {
  return (
    <View style={styles(currentTheme).section}>
      <SkeletonPlaceholder
        currentTheme={currentTheme}
        style={{
          width: scale(140),
          height: scale(22),
          borderRadius: scale(4),
          marginBottom: scale(15)
        }}
      />

      <View style={styles(currentTheme).categoriesGrid}>
        {[1, 2, 3, 4].map((item, index) => (
          <View key={`category-skeleton-${index}`} style={styles(currentTheme).categoryWrapper}>
            <View style={styles(currentTheme).categoryCard}>
              <SkeletonPlaceholder
                currentTheme={currentTheme}
                style={{
                  width: '100%',
                  height: scale(100),
                  borderTopLeftRadius: scale(16),
                  borderTopRightRadius: scale(16)
                }}
              />
              <View
                style={{
                  padding: scale(12),
                  alignItems: 'center'
                }}
              >
                <SkeletonPlaceholder
                  currentTheme={currentTheme}
                  style={{
                    width: '70%',
                    height: scale(16),
                    borderRadius: scale(3)
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

// AnimatedItem component that matches browse categories exactly
const AnimatedItem = ({ index, children }) => {
  const scaleValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      delay: index * 40,
      duration: 500,
      useNativeDriver: true
    }).start()
  }, [index])

  return (
    <Animated.View
      style={{
        opacity: scaleValue
      }}
    >
      {children}
    </Animated.View>
  )
}

const RestaurantSections = ({
  restaurantId,
  configuration,
  navigation,
  currentTheme,
  restaurant // Restaurant details including isOpen, isAvailable
}) => {
  const { t } = useTranslation()
  const { popularItems, categories } = useRestaurantQueries(restaurantId)
  // let popularItems={}
  // let categories={}
  // Animation states
  const [hasPopularAnimated, setHasPopularAnimated] = useState(false)
  const [hasCategoriesAnimated, setHasCategoriesAnimated] = useState(false)

  // Reset animations when new data arrives
  useEffect(() => {
    if (!popularItems.loading && popularItems.data) {
      setHasPopularAnimated(false)
    }
  }, [popularItems.data])

  useEffect(() => {
    if (!categories.loading && categories.data) {
      setHasCategoriesAnimated(false)
    }
  }, [categories.data])

  // Check if restaurant is closed
  const isRestaurantOpen = restaurant?.isOpen
  const isAvailable = restaurant?.isAvailable
  const isRestaurantClosed = !isRestaurantOpen || !isAvailable

  const handleItemClick = (item) => {
    if (isRestaurantClosed) {
      // Show alert if restaurant is closed
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('close'),
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      )
    } else {
      // Navigate directly if restaurant is open
      navigation.navigate('ItemDetail', {
        food: {
          ...item,
          restaurant: restaurantId,
          restaurantName: restaurant?.name
        },
        addons: restaurant?.addons || [],
        options: restaurant?.options || [],
        restaurant: restaurantId
      })
    }
  }

  const handleCategoryClick = (category) => {
    if (isRestaurantClosed) {
      // Show alert if restaurant is closed
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('close'),
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      )
    } else {
      // Navigate directly if restaurant is open
      navigation.navigate('CategoryPage', {
        category: category,
        restaurantId: restaurantId,
        restaurantName: restaurant?.name,
        deliveryTime: restaurant?.deliveryTime || '15-20'
      })
    }
  }

  const renderPopularItem = ({ item, index }) => {
    const variation = item.variations?.[0]
    const price = variation?.price || 0
    const discountedPrice = variation?.discounted

    // Use discounted price only if it exists and is greater than 0, otherwise use base price
    const displayPrice = discountedPrice && discountedPrice > 0 ? discountedPrice : price

    const content = (
      <TouchableOpacity style={styles(currentTheme).popularItemCard} onPress={() => handleItemClick(item)}>
        <TouchableOpacity style={styles(currentTheme).plusButton} onPress={() => handleItemClick(item)}>
          <Ionicons name='add' size={scale(16)} color={currentTheme.fontWhite} />
        </TouchableOpacity>

        <ShimmerImage imageUrl={item.image} style={styles(currentTheme).popularItemImage} resizeMode='cover' />
        <View style={styles(currentTheme).popularItemInfo}>
          <TextDefault style={styles(currentTheme).priceText}>
            {configuration.currencySymbol} {displayPrice}
          </TextDefault>
          <TextDefault numberOfLines={1} style={styles(currentTheme).itemTitle}>
            {item.title}
          </TextDefault>
        </View>
      </TouchableOpacity>
    )

    if (!hasPopularAnimated) {
      return <AnimatedItem index={index}>{content}</AnimatedItem>
    }

    return content
  }

  // const renderCategoryItem = ({ item, index }) => {
  //   const content = (
  //     // update beautifull shadow to category card
  //     <TouchableOpacity style={styles(currentTheme).categoryCard} onPress={() => handleCategoryClick(item)}> 
  //     <ShimmerImage imageUrl={item.url} style={styles(currentTheme).categoryImage} resizeMode='cover' />
  //       <TextDefault numberOfLines={1} style={styles(currentTheme).categoryTitle}>
  //         {item.category_name}
  //       </TextDefault>
  //     </TouchableOpacity>
  //   )

  //   if (!hasCategoriesAnimated) {
  //     return <AnimatedItem index={index}>{content}</AnimatedItem>
  //   }

  //   return content
  // }

  const renderCategoryItem = ({ item, index }) => {
    const content = (
      <TouchableOpacity 
        style={[
          styles(currentTheme).categoryCard,
          // Cross-platform shadow with subtle appearance
          {
            // iOS shadow - subtle and professional
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2, // Reduced for subtlety
            },
            shadowOpacity: 0.08, // Much lighter opacity
            shadowRadius: 3, // Smaller radius for crisp shadow
            // Android shadow
            elevation: 3, // Reduced elevation for consistency
            // Ensure the shadow container has proper background
            backgroundColor: currentTheme.themeBackground || '#FFFFFF',
            // Add these for iOS shadow fix
            borderRadius: scale(16), // Make sure border radius is here
            overflow: 'visible', // Important for shadow visibility
          }
        ]} 
        onPress={() => handleCategoryClick(item)}
      > 
        <ShimmerImage 
          imageUrl={item.url} 
          style={styles(currentTheme).categoryImage} 
          resizeMode='cover' 
        />
        <TextDefault numberOfLines={1} style={styles(currentTheme).categoryTitle}>
          {item.category_name}
        </TextDefault>
      </TouchableOpacity>
    )
  
    if (!hasCategoriesAnimated) {
      return <AnimatedItem index={index}>{content}</AnimatedItem>
    }
  
    return content
  }
  return (
    <View style={styles(currentTheme).container}>
      {/* Popular Section */}
      {popularItems.loading ? (
        <PopularItemsSkeleton currentTheme={currentTheme} />
      ) : (
        popularItems.data?.length > 0 && (
          <View style={styles(currentTheme).section}>
            <View style={styles(currentTheme).sectionHeader}>
              <TextDefault H4 bolder textColor={currentTheme.fontMainColor}>
                Popular
              </TextDefault>
            </View>

            <FlatList
              data={popularItems.data}
              renderItem={renderPopularItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles(currentTheme).popularList}
              ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
              onMomentumScrollEnd={() => {
                if (!hasPopularAnimated && popularItems.data.length > 0) {
                  setHasPopularAnimated(true)
                }
              }}
            />
          </View>
        )
      )}

      {/* Categories Section */}
      {categories.loading ? (
        <CategoriesSkeleton currentTheme={currentTheme} />
      ) : (
        <View style={styles(currentTheme).section}>
          <TextDefault H4 bolder textColor={currentTheme.fontMainColor} style={{ marginBottom: scale(15) }}>
            Find what you want
          </TextDefault>

          <View style={styles(currentTheme).categoriesGrid}>
            {categories.data?.map((category, index) => {
              // Set animation complete after the last category is processed
              if (index === categories.data.length - 1 && !hasCategoriesAnimated) {
                // Use timeout to delay setting the state to allow animation to be visible
                setTimeout(
                  () => {
                    setHasCategoriesAnimated(true)
                  },
                  (index + 1) * 40 + 500
                ) // Delay based on index plus animation duration
              }

              return (
                <View key={category.id} style={styles(currentTheme).categoryWrapper}>
                  {renderCategoryItem({ item: category, index })}
                </View>
              )
            })}
          </View>
        </View>
      )}
    </View>
  )
}

export default RestaurantSections
