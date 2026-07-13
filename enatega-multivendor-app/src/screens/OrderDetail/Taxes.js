import React, { useContext } from 'react'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'

import styles from './styles'
import color from '../../components/Text/TextDefault/styles'

const Taxes = ({ tax, deliveryCharges, currency }) => {
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View >
      <View
        style={{
          flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextDefault
          H5
          isRTL
          bolder
          style={{ ...alignment.Mmedium }}
          textColor={currentTheme.gray900}
          bold
        >
          {' '}
          {t('taxFee')}
        </TextDefault>
        <TextDefault style={{ ...alignment.Mmedium }} bolder H5>
          {' '}
          {currency}{tax}{' '}
        </TextDefault>
      </View>
      <View
        style={{
          flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TextDefault
          H5
          style={{ ...alignment.Mmedium, textAlign: 'center' }}
          textColor={currentTheme.gray900}
          bolder
          isRTL
        >
          {' '}
          {t('delvieryCharges')}
        </TextDefault>
        <TextDefault H5 bolder style={{ ...alignment.Mmedium }}>
          {' '}
          {currency}{deliveryCharges}{' '} 
        </TextDefault>
      </View>
    </View>
  )
}

export default Taxes
