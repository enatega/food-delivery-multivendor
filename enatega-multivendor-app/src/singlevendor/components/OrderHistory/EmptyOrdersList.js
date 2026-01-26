import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const EmptyOrdersList = ({ currentTheme, message, title }) => {
  const { t } = useTranslation()
  const themedStyles = styles(currentTheme)

  return (
    <View style={themedStyles.wrapper}>
      {title && (
        <View style={themedStyles.sectionHeader}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={themedStyles.sectionHeaderText}
            bolder
          >
            {title}
          </TextDefault>
        </View>
      )}
      <View style={themedStyles.container}>
        <View style={themedStyles.iconContainer}>
        <MaterialIcons
          name="receipt-long"
          size={scale(80)}
          color={currentTheme?.colorTextMuted || currentTheme?.fontSecondColor || '#9CA3AF'}
        />
      </View>

      <TextDefault
        textColor={currentTheme?.colorTextMuted || currentTheme?.fontSecondColor}
        style={themedStyles.description}
        center
        bold
      >
        {message || t('No orders found')}
      </TextDefault>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    wrapper: {
      flex: 1
    },
    sectionHeader: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(8),
      backgroundColor: props?.themeBackground
    },
    sectionHeaderText: {
      fontSize: scale(18),
      fontWeight: '600',
      lineHeight: scale(20)
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(20)
    },
    iconContainer: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(60),
      backgroundColor: props?.themeBackground || props?.backgroundColor || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(24),
      ...alignment.MBlarge
    },
    title: {
      fontSize: scale(16),
      marginBottom: verticalScale(8),
      ...alignment.MBsmall
    },
    description: {
      fontSize: scale(14),
      lineHeight: scale(20),
      paddingHorizontal: scale(40),
      color: props?.colorTextMuted || props?.fontSecondColor || '#6B7280'
    }
  })

export default EmptyOrdersList
