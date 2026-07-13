import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const EmptyVouchers = ({ currentTheme }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).illustrationContainer}>
        <Image
          source={require('../../assets/images/empty-vouchers.png')}
          style={styles(currentTheme).illustration}
          resizeMode="contain"
        />
      </View>

      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).title}
        bolder
        center
      >
        {t('No vouchers available')}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).description}
        center
        bold
      >
        {t('Check back soon — exciting offers might appear here!')}
      </TextDefault>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: verticalScale(80),
      ...alignment.PTxLarge
    },
    illustrationContainer: {
      width: scale(250),
      height: scale(200),
      ...alignment.MBlarge
    },
    illustration: {
      width: '100%',
      height: '100%'
    },
    title: {
      fontSize: scale(20),
      ...alignment.MBsmall
    },
    description: {
      fontSize: scale(14),
      lineHeight: scale(20),
      ...alignment.PHlarge
    }
  })

export default EmptyVouchers
