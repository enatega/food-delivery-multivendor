import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  style,
  textStyle,
  ...props
}) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)
  const isDisabled = disabled || loading
  const textColor = variant === 'primary'
    ? tokens.colors.textOnAccent
    : variant === 'danger'
      ? tokens.colors.textOnDanger
      : tokens.colors.textPrimary

  return (
    <Pressable
      accessibilityRole='button'
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        themedStyles.base,
        themedStyles[variant],
        pressed && themedStyles.pressed,
        isDisabled && themedStyles.disabled,
        style
      ]}
      {...props}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : (
          <View style={themedStyles.content}>
            {icon}
            <TextDefault textColor={textColor} style={[themedStyles.label, textStyle]} bolder>
              {label}
            </TextDefault>
          </View>
          )}
    </Pressable>
  )
}

const styles = (tokens) => StyleSheet.create({
  base: {
    minHeight: tokens.sizes.primaryButton,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: tokens.colors.accent
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderStandard
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  danger: {
    backgroundColor: tokens.colors.danger
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm
  },
  label: {
    ...tokens.typeScale.bodyStrong
  },
  pressed: {
    opacity: 0.78
  },
  disabled: {
    opacity: 0.42
  }
})

export default PrimaryButton
