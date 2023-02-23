import { View } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'

import { RequestRow } from './WithDrawRequestCard'
import ConfigurationContext from '../../context/configuration'

const WalletCard = ({ item }) => {
  const configuration = useContext(ConfigurationContext)
  return (
    <View style={[styles.container, styles.bgWhite]}>
      <TextDefault bold H4 textColor={colors.black}>
        {'Order ID:'}{' '}
        <TextDefault bolder H4 textColor={colors.primary}>
          {item?.orderId}
        </TextDefault>{' '}
      </TextDefault>
      <View style={styles.horizontalLine} />
      <RequestRow
        label={'Delivery Fee'}
        value={`${configuration.currencySymbol} ${item?.deliveryFee.toFixed(
          2
        )}`}
      />
      <RequestRow
        label={'Delivery Time'}
        value={new Date(item?.deliveryTime).toLocaleString()}
      />
      <RequestRow label={'Payment Method'} value={item?.paymentMethod} />
      <RequestRow
        label={'Order Status'}
        value={item?.orderStatus}
        color={colors.primary}
      />
    </View>
  )
}

export default WalletCard
