import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const SheetHeader = ({ title, onClose, action, showHandle = true, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <View style={[themedStyles.container, style]}>
      {showHandle && <View style={themedStyles.handle} />}
      <View style={themedStyles.row}>
        <View style={themedStyles.side} />
        <TextDefault numberOfLines={1} textColor={tokens.colors.textPrimary} style={themedStyles.title} bolder>
          {title}
        </TextDefault>
        <View style={[themedStyles.side, themedStyles.right]}>
          {action || (onClose && (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='Close'
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [themedStyles.closeButton, pressed && themedStyles.pressed]}
            >
              <Feather name='x' size={20} color={tokens.colors.textPrimary} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: tokens.radii.round,
    backgroundColor: tokens.colors.borderStandard,
    alignSelf: 'center',
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm
  },
  row: {
    minHeight: tokens.sizes.touchTarget,
    flexDirection: 'row',
    alignItems: 'center'
  },
  side: {
    width: tokens.sizes.touchTarget
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...tokens.typeScale.heading
  },
  closeButton: {
    width: tokens.sizes.iconButton,
    height: tokens.sizes.iconButton,
    borderRadius: tokens.radii.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceSubtle
  },
  pressed: {
    opacity: 0.7
  }
})

export default SheetHeader
