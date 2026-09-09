import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { formatNumber } from '../../utils/formatNumber'
import { scale } from '../../utils/scaling'

const Taxes = ({ tax, deliveryCharges, currency, tip, discountAmount, theme }) => {
  const { t } = useTranslation()
  const rows = [
    { amount: tax, title: 'taxFee' },
    { amount: deliveryCharges, title: 'delvieryCharges' },
    { amount: tip, title: 'tip' },
    { amount: discountAmount, title: 'voucherDiscount', negative: true }
  ]

  return rows.map((row) => (
    <View
      key={row.title}
      style={{
        alignItems: 'center',
        flexDirection: theme.isRTL ? 'row-reverse' : 'row',
        justifyContent: 'space-between',
        minHeight: scale(34)
      }}
    >
      <TextDefault H5 textColor={theme.colors.textSecondary} isRTL>
        {t(row.title)}
      </TextDefault>
      <TextDefault H5 textColor={theme.colors.textPrimary} isRTL>
        {row.negative && Number(row.amount) > 0 ? '-' : ''}
        {currency}
        {formatNumber(Number(row.amount) || 0)}
      </TextDefault>
    </View>
  ))
}

export default Taxes
