// components/SmallHeader/SmallHeader.js
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import styles from './styles'

function RestaurantCompactHeader({
  navigation,
  restaurantData,
  currentTheme,
  handleOpenSearch,
  handleNavigateToAbout
}) {
  return (
    <View style={styles(currentTheme).container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles(currentTheme).iconButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name='arrow-back-circle-sharp'
          color={currentTheme.fontMainColor}
          size={scale(32)}
        />
      </TouchableOpacity>

      <View style={styles(currentTheme).titleContainer}>
        <TextDefault
          H4
          bolder
          textColor={currentTheme.fontMainColor}
          numberOfLines={1}
          style={styles(currentTheme).title}
        >
          {restaurantData?.restaurant?.name}
        </TextDefault>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles(currentTheme).iconButton}
        onPress={handleOpenSearch}
      >
        <Ionicons
          name='search-circle-sharp'
          size={scale(32)}
          color={currentTheme.fontMainColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles(currentTheme).iconButton}
        onPress={handleNavigateToAbout}
      >
        <Ionicons
          name='information-circle-sharp'
          size={scale(32)}
          color={currentTheme.fontMainColor}
        />
      </TouchableOpacity>
    </View>
  )
}

export default RestaurantCompactHeader
