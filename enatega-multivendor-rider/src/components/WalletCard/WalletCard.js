import { View } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import i18n from '../../../i18n'

import { RequestRow } from './WithDrawRequestCard'
import ConfigurationContext from '../../context/configuration'

const WalletCard = ({ item }) => {
  const configuration = useContext(ConfigurationContext)
  return (
    <View style={[styles.container, styles.bgWhite]}>
      <TextDefault bold H4 textColor={colors.black}>
        {i18n.t('orderID')}{' '}
        <TextDefault bolder H4 textColor={colors.primary}>
          {item?.orderId}
        </TextDefault>{' '}
      </TextDefault>
      <View style={styles.horizontalLine} />
      <RequestRow
        label={i18n.t('deliveryFee')}
        value={`${configuration.currencySymbol} ${item?.deliveryFee.toFixed(
          2
        )}`}
      />
      <RequestRow
        label={i18n.t('deliveryTime')}
        value={new Date(item?.deliveryTime).toLocaleString()}
      />
      <RequestRow label={i18n.t('paymentMethod')} value={item?.paymentMethod} />
      <RequestRow
        label={i18n.t('orderStatus')}
        value={item?.orderStatus}
        color={colors.primary}
      />
    </View>
  )
}

export default WalletCard
