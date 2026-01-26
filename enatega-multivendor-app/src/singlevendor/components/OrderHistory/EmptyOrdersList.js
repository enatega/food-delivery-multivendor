import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const EmptyOrdersList = ({ currentTheme, message }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).iconContainer}>
        <MaterialIcons
          name="receipt-long"
          size={scale(80)}
          color={currentTheme?.colorTextMuted || currentTheme?.fontSecondColor || '#9CA3AF'}
        />
      </View>

      <TextDefault
        textColor={currentTheme?.fontMainColor}
        style={styles(currentTheme).title}
        bolder
        center
      >
        {message || t('No orders found')}
      </TextDefault>

      <TextDefault
        textColor={currentTheme?.colorTextMuted || currentTheme?.fontSecondColor}
        style={styles(currentTheme).description}
        center
        bold
      >
        {t('Your orders will appear here once you place them')}
      </TextDefault>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',

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
