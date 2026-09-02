import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const StateView = ({ visual, title, description, action, compact = false, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <View style={[themedStyles.container, compact && themedStyles.compact, style]}>
      {!!visual && <View style={themedStyles.visual}>{visual}</View>}
      <TextDefault textColor={tokens.colors.textPrimary} style={themedStyles.title} bolder center>
        {title}
      </TextDefault>
      {!!description && (
        <TextDefault textColor={tokens.colors.textMuted} style={themedStyles.description} center>
          {description}
        </TextDefault>
      )}
      {!!action && <View style={themedStyles.action}>{action}</View>}
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.section
  },
  compact: {
    flex: 0,
    minHeight: 0
  },
  visual: {
    marginBottom: tokens.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    ...tokens.typeScale.heading
  },
  description: {
    maxWidth: scaleDescriptionWidth,
    marginTop: tokens.spacing.sm,
    ...tokens.typeScale.body
  },
  action: {
    marginTop: tokens.spacing.xl
  }
})

const scaleDescriptionWidth = '92%'

export default StateView
