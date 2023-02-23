import { View } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import ConfigurationContext from '../../context/configuration'

const STATUS_COLORS = {
  CANCELLED: colors.orderUncomplete,
  REQUESTED: colors.textErrorColor,
  TRANSFERRED: colors.primary
}

const RequestCard = ({ item }) => {
  const configuration = useContext(ConfigurationContext)
  return (
    <View style={[styles.container, styles.bgBlack]}>
      <TextDefault bold H4 textColor={colors.white}>
        {'Request ID:'}{' '}
        <TextDefault bolder H4 textColor={colors.primary}>
          {item?.requestId}
        </TextDefault>{' '}
      </TextDefault>
      <View style={styles.horizontalLine} />
      <RequestRow
        label={'Name'}
        value={item?.rider.name}
        color={colors.white}
      />
      <RequestRow
        label={'Email'}
        value={item?.rider.email}
        color={colors.white}
      />
      <RequestRow
        label={'Account Number'}
        value={item?.rider.accountNumber}
        color={colors.white}
      />
      <RequestRow
        label={'Request Amount'}
        value={`${configuration.currencySymbol} ${item?.requestAmount.toFixed(
          2
        )}`}
        color={colors.white}
      />
      <RequestRow
        label={'RequestTime'}
        value={new Date(item?.requestTime).toDateString()}
        color={colors.white}
      />
      <RequestRow
        label={'Status'}
        value={item?.status}
        color={STATUS_COLORS[item?.status]}
      />
    </View>
  )
}

export const RequestRow = ({ label, value, color = colors.black }) => {
  return (
    <View style={styles.requestDetails}>
      <TextDefault
        style={styles.col1}
        textColor={colors.fontSecondColor}
        bolder>
        {label}
      </TextDefault>
      <TextDefault style={styles.col2} textColor={color} bold>
        {value}
      </TextDefault>
    </View>
  )
}

export default RequestCard
