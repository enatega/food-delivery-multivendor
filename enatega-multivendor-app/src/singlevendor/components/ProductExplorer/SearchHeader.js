import React, { memo } from 'react'
import { View, TextInput, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from '../Checkout/useCheckoutPalette'

const SearchHeader = ({ value, placeholder = 'Search', onChangeText, onBackPress, onPressSearch }) => {
  const { palette, isRTL } = useCheckoutPalette()
  const s = styles(palette)
  return (
    <View style={s.container}>
      <Pressable style={({ pressed }) => [s.backButton, pressed && s.pressed]} onPress={onBackPress} hitSlop={10} accessibilityRole='button'>
        <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={palette.textPrimary} />
      </Pressable>

      <View style={s.searchContainer}>
        <Ionicons name='search' size={18} color={palette.textMuted} style={s.searchIcon} />
        {onPressSearch
          ? (
          <Pressable onPress={onPressSearch} style={[s.input, s.tapContainer]} accessibilityRole='search'>
            <TextDefault textColor={palette.textMuted} numberOfLines={1}>
              {placeholder}
            </TextDefault>
          </Pressable>
            )
          : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={palette.textMuted}
            selectionColor={palette.brand}
            style={[s.input, isRTL && s.inputRTL]}
            returnKeyType='search'
          />
            )}
      </View>
    </View>
  )
}

export default memo(SearchHeader)

const styles = (palette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 6,
      paddingBottom: 8
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surfaceMuted
    },
    pressed: {
      opacity: 0.7
    },
    searchContainer: {
      flex: 1,
      marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      height: 42,
      borderRadius: 21,
      paddingHorizontal: 14,
      backgroundColor: palette.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border
    },
    searchIcon: {
      marginRight: 8
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: palette.textPrimary,
      paddingVertical: 0, // Android alignment fix
      height: '100%'
    },
    inputRTL: {
      textAlign: 'right'
    },
    tapContainer: {
      justifyContent: 'center'
    }
  })
