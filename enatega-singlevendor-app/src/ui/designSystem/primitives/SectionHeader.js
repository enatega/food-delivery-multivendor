import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useMultivendorTheme from '../useMultivendorTheme'

const SectionHeader = ({ title, action, description, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <View style={[themedStyles.container, style]}>
      <View style={themedStyles.row}>
        <TextDefault textColor={tokens.colors.textPrimary} style={themedStyles.title} bolder>
          {title}
        </TextDefault>
        {action}
      </View>
      {!!description && (
        <TextDefault textColor={tokens.colors.textMuted} style={themedStyles.description}>
          {description}
        </TextDefault>
      )}
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md
  },
  title: {
    flex: 1,
    ...tokens.typeScale.heading
  },
  description: {
    marginTop: tokens.spacing.xs,
    ...tokens.typeScale.body
  }
})

export default SectionHeader
