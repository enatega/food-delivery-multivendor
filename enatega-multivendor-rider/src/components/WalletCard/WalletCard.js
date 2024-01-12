import { View } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import CustomColors from '../../utilities/colors'
import { useTranslation } from 'react-i18next'

import { RequestRow } from './WithDrawRequestCard'
import ConfigurationContext from '../../context/configuration'

const WalletCard = ({ item }) => {
  const { t } = useTranslation()
  const { colors } = CustomColors()
  const configuration = useContext(ConfigurationContext)
  return (
    <View style={[styles(colors).container, styles(colors).bgWhite]}>
      <TextDefault bold H4 textColor={colors.black}>
        {t('orderID')}{' '}
        <TextDefault bolder H4 textColor={colors.primary}>
          {item?.orderId}
        </TextDefault>{' '}
      </TextDefault>
      <View style={styles(colors).horizontalLine} />
      <RequestRow
        label={t('deliveryFee')}
        value={`${configuration.currencySymbol} ${item?.deliveryFee.toFixed(
          2
        )}`}
      />
      <RequestRow
        label={t('deliveryTime')}
        value={new Date(item?.deliveryTime).toLocaleString()}
      />
      <RequestRow label={t('paymentMethod')} value={item?.paymentMethod} />
      <RequestRow
        label={t('orderStatus')}
        value={item?.orderStatus}
        color={colors.primary}
      />
    </View>
  )
}

export default WalletCard
