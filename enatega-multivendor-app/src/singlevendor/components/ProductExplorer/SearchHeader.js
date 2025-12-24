import React, { memo, useContext } from 'react'
import { View, TextInput, StyleSheet, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'

const SearchHeader = ({ value, placeholder = 'Search', onChangeText, onBackPress, onPressSearch }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={onBackPress} hitSlop={10}>
        <Ionicons name='arrow-back' size={22} color='#000' />
      </Pressable>

      <View style={styles.searchContainer}>
        <Ionicons name='search' size={18} color='#999' style={styles.searchIcon} />
        {onPressSearch ? (
          <Pressable onPress={onPressSearch} style={[styles.input, styles.tapContainer]}>
            <TextDefault textColor={currentTheme.fontSecondColor} bold  style={{  }}>
              {placeholder}
            </TextDefault>
          </Pressable>
        ) : (
          <TextInput onPress={onPressSearch} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor='#999' style={styles.input} returnKeyType='search' />
        )}
      </View>
    </View>
  )
}

export default memo(SearchHeader)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF'
  },
  backButton: {
    backgroundColor: '#F2F2F2',
    padding: 8,
    borderRadius: 50
  },
  searchContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 2,
    borderColor: '#F2F2F2'
  },

  searchIcon: {
    marginRight: 6
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0 // Android alignment fix
  },
  tapContainer: {
    minWidth: '100%',
    minHeight: '100%',
    
    justifyContent:'center'
  }
})
