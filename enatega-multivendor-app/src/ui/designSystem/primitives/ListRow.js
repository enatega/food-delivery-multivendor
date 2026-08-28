import React from 'react'
import { I18nManager, Pressable, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import Divider from './Divider'
import useMultivendorTheme from '../useMultivendorTheme'

const ListRow = ({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  showChevron = !!onPress,
  showDivider = true,
  disabled = false,
  style
}) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress || disabled}
      onPress={onPress}
      style={({ pressed } = {}) => [
        themedStyles.container,
        pressed && themedStyles.pressed,
        disabled && themedStyles.disabled,
        style
      ]}
    >
      <View style={themedStyles.content}>
        {!!leading && <View style={themedStyles.leading}>{leading}</View>}
        <View style={themedStyles.textContent}>
          <TextDefault numberOfLines={1} textColor={tokens.colors.textPrimary} style={themedStyles.title}>
            {title}
          </TextDefault>
          {!!subtitle && (
            <TextDefault numberOfLines={2} textColor={tokens.colors.textMuted} style={themedStyles.subtitle}>
              {subtitle}
            </TextDefault>
          )}
        </View>
        {!!trailing && <View style={themedStyles.trailing}>{trailing}</View>}
        {showChevron && (
          <Ionicons
            name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color={tokens.colors.textMuted}
          />
        )}
      </View>
      {showDivider && <Divider insetStart={leading ? tokens.sizes.touchTarget + tokens.spacing.md : 0} />}
    </Pressable>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    minHeight: tokens.sizes.headerContent,
    paddingHorizontal: tokens.spacing.lg
  },
  content: {
    minHeight: tokens.sizes.headerContent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md
  },
  leading: {
    width: tokens.sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContent: {
    flex: 1,
    paddingVertical: tokens.spacing.sm
  },
  title: {
    ...tokens.typeScale.bodyStrong
  },
  subtitle: {
    marginTop: tokens.spacing.xxs,
    ...tokens.typeScale.caption
  },
  trailing: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  pressed: {
    backgroundColor: tokens.colors.surfaceSubtle
  },
  disabled: {
    opacity: 0.45
  }
})

export default ListRow
