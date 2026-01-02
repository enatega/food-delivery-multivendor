import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'

const RenderCategoryCard = ({ item: category, currentTheme, handleCategoryPress, widthSize }) => {
  return (
    <TouchableOpacity style={[styles(currentTheme).categoryCard, {width: widthSize ? widthSize : 80}]} onPress={() => handleCategoryPress(category?.viewType, category?.id)} activeOpacity={0.7}>
      <View style={[styles(currentTheme).imageContainer, { width: widthSize ? widthSize : 80, height: widthSize ? widthSize : 80 }]}>
        <Image source={{ uri: category?.image }} style={styles(currentTheme).categoryImage} resizeMode='cover' />
      </View>
      <Text style={styles(currentTheme).categoryLabel}>{category.name}</Text>
    </TouchableOpacity>
  )
}

export default RenderCategoryCard

const styles = (currentTheme) =>
  StyleSheet.create({
    categoryCard: {
      marginRight: 16,
      alignItems: 'center',
    },
    imageContainer: {
      backgroundColor: currentTheme.cardBackground,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 8,
      shadowColor: currentTheme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    categoryImage: {
      width: '100%',
      height: '100%'
    },
    categoryLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: currentTheme.fontMainColor,
      textAlign: 'center'
    }
  })
