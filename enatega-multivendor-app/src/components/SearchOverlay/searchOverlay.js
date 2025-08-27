// SearchOverlay.js
import React, { useState, useEffect } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StatusBar,
  Alert
} from 'react-native'
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import Search from '../Main/Search/Search'
import { scale } from '../../utils/scaling'
import { escapeRegExp } from '../../utils/regex'
import ShimmerImage from '../ShimmerImage/ShimmerImage'
import { useTranslation } from 'react-i18next'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight

const SearchOverlay = ({
  isVisible,
  onClose,
  currentTheme,
  configuration,
  restaurant,
  navigation
}) => {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const isRTL = i18n.dir() === 'rtl' || currentTheme.isRTL

  useEffect(() => {
    if (!restaurant?.categories) return

    if (search === '') {
      const filteredData = []
      restaurant.categories.forEach((category) => {
        category.foods?.forEach((food) => {
          // Include all items, even out-of-stock ones
          filteredData.push(food)
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(false)
    } else {
      const escapedSearchText = escapeRegExp(search)
      const regex = new RegExp(escapedSearchText, 'i')
      const filteredData = []

      restaurant.categories.forEach((category) => {
        category.foods?.forEach((food) => {
          // Include all matching items regardless of stock status
          const title = food.title.search(regex)
          if (title >= 0 || food.description.search(regex) >= 0) {
            filteredData.push(food)
          }
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(true)
    }
  }, [search, restaurant])

  const isRestaurantOpen = restaurant?.isOpen && restaurant?.isAvailable

  const onPressItem = (food) => {
    if (food.isOutOfStock) {
      // Display an alert if the item is out of stock
      Alert.alert('Currently Unavailable', 'Item Out of Stock')
      return
    }
    
    if (!isRestaurantOpen) {
      // Show alert if restaurant is closed
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('סגור'), // Hebrew for "close"
            onPress: () => {
              // Just close the search overlay
              onClose()
            },
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => {
              // Stay on search, don't navigate away
              // Do nothing here
            }
          }
        ],
        { cancelable: true }
      )
    } else {
      // Only navigate if restaurant is open
      navigation.navigate('ItemDetail', {
        food: {
          ...food,
          restaurant: restaurant?._id,
          restaurantName: restaurant?.name
        },
        addons: restaurant?.addons || [],
        options: restaurant?.options || [],
        restaurant: restaurant?._id
      })
      onClose() // Close the search overlay after navigation
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        padding: scale(15),
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.borderColor
      }, 
      { opacity: item.isOutOfStock ? 0.5 : 1 }]}
      activeOpacity={0.7}
      onPress={() => onPressItem(item)}
    >
      <ShimmerImage
        style={{
          height: scale(60),
          width: scale(60),
          borderRadius: scale(8)
        }}
        imageUrl={item.image}
      />

      <View style={{ 
        flex: 1, 
        marginLeft: isRTL ? 0 : scale(15), 
        marginRight: isRTL ? scale(15) : 0,
        alignItems: isRTL ? 'flex-end' : 'flex-start'
      }}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          style={{ 
            fontSize: scale(16), 
            marginBottom: scale(4),
            textAlign: isRTL ? 'right' : 'left' 
          }}
          bold
          isRTL={isRTL}
        >
          {item.title}
        </TextDefault>

        <TextDefault
          numberOfLines={2}
          textColor={currentTheme.fontSecondColor}
          style={{ 
            fontSize: scale(14), 
            marginBottom: scale(4),
            textAlign: isRTL ? 'right' : 'left'
          }}
          isRTL={isRTL}
        >
          {item.description}
        </TextDefault>

        <View style={{ 
          flexDirection: isRTL ? 'row-reverse' : 'row', 
          alignItems: 'center' 
        }}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={{ fontSize: scale(16) }}
            bold
            isRTL={isRTL}
          >
            {configuration.currencySymbol}
            {item.variations[0].price}
          </TextDefault>
          {item.variations[0].discounted > 0 && (
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              style={{
                fontSize: scale(14),
                marginLeft: isRTL ? 0 : scale(8),
                marginRight: isRTL ? scale(8) : 0,
                textDecorationLine: 'line-through'
              }}
              isRTL={isRTL}
            >
              {configuration.currencySymbol}
              {(
                item.variations[0].price + item.variations[0].discounted
              ).toFixed(2)}
            </TextDefault>
          )}
        </View>
      </View>

      <View
        style={{
          backgroundColor: currentTheme.primary,
          width: scale(32),
          height: scale(32),
          borderRadius: scale(16),
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}
      >
        <MaterialIcons
          name='add'
          size={scale(20)}
          color={currentTheme.white}
        />
      </View>
    </TouchableOpacity>
  )

  const keyExtractor = (item, index) => `food-item-${item._id || index}`

  if (!isVisible) return null

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: currentTheme.themeBackground,
        zIndex: 1000
      }}
    >
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          paddingHorizontal: scale(15),
          paddingTop: STATUSBAR_HEIGHT + scale(5),
          backgroundColor: currentTheme.themeBackground,
          height: scale(50) + STATUSBAR_HEIGHT
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: scale(24),
            height: scale(24),
            borderRadius: scale(16),
            backgroundColor: currentTheme.grey100,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Entypo
            name='cross'
            color={currentTheme.fontMainColor}
            size={scale(20)}
          />
        </TouchableOpacity>

        <Search
          setSearch={setSearch}
          search={search}
          newheaderColor={currentTheme.themeBackground}
          cartContainer={currentTheme.fontSecondColor}
          placeHolder={`Search in ${restaurant?.name}`}
          containerStyle={{ flex: 1 }}
          isRTL={isRTL}
        />
      </View>

      <FlatList
        data={filterData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{ flex: 1, marginTop: scale(10) }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', paddingTop: scale(40) }}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              style={{ fontSize: scale(16) }}
            >
              {search ? t('noResultsFound') : t('searchForFood')}
            </TextDefault>
          </View>
        )}
      />
    </Animated.View>
  )
}

export default SearchOverlay