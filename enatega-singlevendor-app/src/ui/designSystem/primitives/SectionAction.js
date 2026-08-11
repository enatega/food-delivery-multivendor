import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const SectionAction = ({ label, onPress, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <Pressable
      accessibilityRole='button'
      disabled={!onPress}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        themedStyles.button,
        pressed && themedStyles.pressed,
        style
      ]}
    >
      <TextDefault textColor={tokens.colors.accent} style={themedStyles.label}>
        {label}
      </TextDefault>
    </Pressable>
  )
}

const styles = (tokens) => StyleSheet.create({
  button: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm - tokens.spacing.xxs,
    borderRadius: tokens.spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderStandard,
    backgroundColor: tokens.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    ...tokens.typeScale.body,
    fontWeight: '500'
  },
  pressed: {
    opacity: 0.72
  }
})

export default SectionAction
