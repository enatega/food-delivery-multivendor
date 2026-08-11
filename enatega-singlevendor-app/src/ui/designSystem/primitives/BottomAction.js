import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useMultivendorTheme from '../useMultivendorTheme'

const BottomAction = ({ children, border = true, style }) => {
  const insets = useSafeAreaInsets()
  const { tokens } = useMultivendorTheme()

  return (
    <View
      style={[
        styles(tokens).container,
        border && styles(tokens).border,
        { paddingBottom: Math.max(insets.bottom, tokens.spacing.md) },
        style
      ]}
    >
      {children}
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.canvas,
    paddingTop: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg
  },
  border: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.borderSubtle
  }
})

export default BottomAction
