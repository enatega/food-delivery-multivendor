// SearchOverlay.js
import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StatusBar
} from 'react-native'
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import Search from '../Main/Search/Search'
import { scale } from '../../utils/scaling'
import { escapeRegExp } from '../../utils/regex'
import ShimmerImage from '../ShimmerImage/ShimmerImage'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight

const SearchOverlay = ({
  isVisible,
  onClose,
  currentTheme,
  configuration,
  restaurant,
  navigation
}) => {
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    if (!restaurant?.categories) return

    if (search === '') {
      const filteredData = []
      restaurant.categories.forEach((category) => {
        category.foods?.forEach((food) => {
          if (!food.isOutOfStock) {
            filteredData.push(food)
          }
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
          if (!food.isOutOfStock) {
            const title = food.title.search(regex)
            if (title >= 0 || food.description.search(regex) >= 0) {
              filteredData.push(food)
            }
          }
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(true)
    }
  }, [search, restaurant])

  const onPressItem = (food) => {
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
  }

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
          flexDirection: 'row',
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
        />
      </View>

      <ScrollView style={{ flex: 1, marginTop: scale(10) }}>
        {filterData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              padding: scale(15),
              borderBottomWidth: 1,
              borderBottomColor: currentTheme.borderColor
            }}
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

            <View style={{ flex: 1, marginLeft: scale(15) }}>
              <TextDefault
                numberOfLines={1}
                textColor={currentTheme.fontMainColor}
                style={{ fontSize: scale(16), marginBottom: scale(4) }}
                bold
              >
                {item.title}
              </TextDefault>

              <TextDefault
                numberOfLines={2}
                textColor={currentTheme.fontSecondColor}
                style={{ fontSize: scale(14), marginBottom: scale(4) }}
              >
                {item.description}
              </TextDefault>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  style={{ fontSize: scale(16) }}
                  bold
                >
                  {configuration.currencySymbol}
                  {item.variations[0].price}
                </TextDefault>
                {item.variations[0].discounted > 0 && (
                  <TextDefault
                    textColor={currentTheme.fontSecondColor}
                    style={{
                      fontSize: scale(14),
                      marginLeft: scale(8),
                      textDecorationLine: 'line-through'
                    }}
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
        ))}
      </ScrollView>
    </Animated.View>
  )
}

export default SearchOverlay
