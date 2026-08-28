import React from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import useMultivendorTheme from '../useMultivendorTheme'

const SearchField = ({ value, onChangeText, onClear, clearAccessibilityLabel = 'Clear search', style, inputStyle, ...props }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <View style={[themedStyles.container, style]}>
      <Feather name='search' size={19} color={tokens.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={tokens.colors.textMuted}
        selectionColor={tokens.colors.accent}
        style={[themedStyles.input, inputStyle]}
        {...props}
      />
      {!!value && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel={clearAccessibilityLabel}
          hitSlop={10}
          onPress={onClear || (() => onChangeText?.(''))}
          style={({ pressed }) => pressed && themedStyles.pressed}
        >
          <Feather name='x-circle' size={18} color={tokens.colors.textMuted} />
        </Pressable>
      )}
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    minHeight: tokens.sizes.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.surfaceSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderSubtle
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: tokens.colors.textPrimary,
    ...tokens.typeScale.body
  },
  pressed: {
    opacity: 0.65
  }
})

export default SearchField
