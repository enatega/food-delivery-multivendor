import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useMultivendorTheme from '../useMultivendorTheme'

const ScreenContainer = ({ children, includeTopInset = false, edges, style, ...props }) => {
  const { tokens } = useMultivendorTheme()
  const safeAreaEdges = edges || (includeTopInset
    ? ['top', 'right', 'bottom', 'left']
    : ['right', 'bottom', 'left'])

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles(tokens).container, style]}
      {...props}
    >
      {children}
    </SafeAreaView>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.canvas
  }
})

export default ScreenContainer
