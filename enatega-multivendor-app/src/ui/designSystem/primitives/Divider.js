import React from 'react'
import { StyleSheet, View } from 'react-native'
import useMultivendorTheme from '../useMultivendorTheme'

const Divider = ({ insetStart = 0, insetEnd = 0, strong = false, style }) => {
  const { tokens } = useMultivendorTheme()

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={[
        styles(tokens, strong).divider,
        { marginStart: insetStart, marginEnd: insetEnd },
        style
      ]}
    />
  )
}

const styles = (tokens, strong) => StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: strong
      ? tokens.colors.borderStandard
      : tokens.colors.borderSubtle
  }
})

export default Divider
