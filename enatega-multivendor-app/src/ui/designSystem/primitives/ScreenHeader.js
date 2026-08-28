import React from 'react'
import { I18nManager, Pressable, StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const ScreenHeader = ({
  title,
  onBack,
  showBack = true,
  right,
  includeTopInset = true,
  border = false,
  backAccessibilityLabel = 'Go back',
  style,
  titleStyle
}) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  const handleBack = () => {
    if (onBack) return onBack()
    if (navigation.canGoBack()) navigation.goBack()
  }

  return (
    <View
      style={[
        themedStyles.container,
        includeTopInset && { paddingTop: insets.top },
        border && themedStyles.bordered,
        style
      ]}
    >
      <View style={themedStyles.content}>
        <View style={themedStyles.side}>
          {showBack && (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel={backAccessibilityLabel}
              hitSlop={8}
              onPress={handleBack}
              style={({ pressed }) => [
                themedStyles.backButton,
                pressed && themedStyles.pressed
              ]}
            >
              <AntDesign
                name={I18nManager.isRTL ? 'arrowright' : 'arrowleft'}
                size={20}
                color={tokens.colors.textPrimary}
              />
            </Pressable>
          )}
        </View>

        <TextDefault
          numberOfLines={1}
          textColor={tokens.colors.textPrimary}
          style={[themedStyles.title, titleStyle]}
          bolder
        >
          {title}
        </TextDefault>

        <View style={[themedStyles.side, themedStyles.right]}>{right}</View>
      </View>
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.canvas
  },
  content: {
    height: tokens.sizes.headerContent,
    paddingHorizontal: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bordered: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.borderSubtle
  },
  side: {
    width: tokens.sizes.touchTarget,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  right: {
    alignItems: 'flex-end'
  },
  backButton: {
    width: tokens.sizes.iconButton,
    height: tokens.sizes.iconButton,
    borderRadius: tokens.radii.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderSubtle
  },
  pressed: {
    opacity: 0.72
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...tokens.typeScale.heading
  }
})

export default ScreenHeader
