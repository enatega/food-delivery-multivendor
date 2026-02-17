import React, { useContext } from 'react'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { FlatList, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'

const Taxes = ({ tax, deliveryCharges, currency, tip, discountAmount }) => {
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const data = [
    { amount: tax, title: 'taxFee' },
    { amount: deliveryCharges, title: 'delvieryCharges' },
    { amount: tip, title: 'tip' },
    { amount: discountAmount, title: 'voucherDiscount' }
  ]

  const renderItem = (item) => {
    return (
      <View
        style={{
          flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TextDefault H5 style={{ ...alignment.Mmedium, textAlign: 'center' }} textColor={currentTheme.gray900} bolder isRTL>
          {' '}
          {t(item?.title)}
        </TextDefault>
        <TextDefault H5 bolder style={{ ...alignment.Mmedium }}>
          {' '}
          {item?.title === 'voucherDiscount' && '-'}
          {currency}
          {item?.amount}{' '}
        </TextDefault>
      </View>
    )
  }

  return (
    <View>
      <FlatList data={data} renderItem={({ item }) => renderItem(item)} />
    </View>
  )
}

export default Taxes
