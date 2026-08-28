import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const FilterChip = ({ label, selected = false, onPress, disabled = false, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        themedStyles.base,
        selected && themedStyles.selected,
        pressed && themedStyles.pressed,
        disabled && themedStyles.disabled,
        style
      ]}
    >
      <TextDefault
        textColor={selected ? tokens.colors.textPrimary : tokens.colors.textSecondary}
        style={themedStyles.label}
        bold={selected}
      >
        {label}
      </TextDefault>
    </Pressable>
  )
}

const styles = (tokens) => StyleSheet.create({
  base: {
    minHeight: tokens.sizes.touchTarget,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderSubtle
  },
  selected: {
    backgroundColor: tokens.colors.accentSubtle,
    borderColor: tokens.colors.accent
  },
  label: {
    ...tokens.typeScale.body
  },
  pressed: {
    opacity: 0.72
  },
  disabled: {
    opacity: 0.42
  }
})

export default FilterChip
