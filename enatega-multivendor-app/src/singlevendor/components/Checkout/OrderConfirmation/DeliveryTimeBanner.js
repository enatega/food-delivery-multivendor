import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import TextDefault from '../../../../components/Text/TextDefault/TextDefault'

const DeliveryTimeBanner = ({ minTime = 15, maxTime = 25, isPickUpOrder = false }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault textColor='#fff' h5 isRTL bold>
        {isPickUpOrder
          ? (t('Estimated collection time') || 'Estimated collection time')
          : (t('Estimated delivery time') || 'Estimated delivery time')}
      </TextDefault>
      <TextDefault textColor='#fff' H3 bolder isRTL style={styles().timeText}>
        {minTime}-{maxTime} {t('mins') || 'mins'}
      </TextDefault>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      backgroundColor: props?.singlevendorcolor || '#0090CD',
      paddingVertical: scale(14),
      paddingHorizontal: scale(16),
      alignItems: 'center',
      borderRadius: scale(12),
      marginHorizontal: scale(16),
      marginTop: scale(8)
    },
    timeText: {
      marginTop: scale(2)
    }
  })

export default DeliveryTimeBanner
