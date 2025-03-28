// SubcategoryList/SubcategoryList.js
import React from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from './styles'

const SubcategoryList = ({
  currentTheme,
  subcategories,
  selectedIndex,
  onSelectSubcategory
}) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedIndex === item.index

    return (
      <TouchableOpacity
        style={[
          styles(currentTheme).subcategoryItem,
          isSelected && styles(currentTheme).selectedSubcategoryItem
        ]}
        onPress={() => onSelectSubcategory(item)}
      >
        <TextDefault
          style={[
            styles(currentTheme).subcategoryText,
            isSelected && styles(currentTheme).selectedSubcategoryText
          ]}
          textColor={
            isSelected ? currentTheme.buttonText : currentTheme.fontMainColor
          }
        >
          {item.title}sdsd
        </TextDefault>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles(currentTheme).container}>
      <FlatList
        data={subcategories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).listContainer}
      />
    </View>
  )
}

export default SubcategoryList
