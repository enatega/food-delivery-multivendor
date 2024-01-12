import { View } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import CustomColors from '../../utilities/colors'
import ConfigurationContext from '../../context/configuration'
import { useTranslation } from 'react-i18next'

const RequestCard = ({ item }) => {
  const { t } = useTranslation()
  const { colors } = CustomColors()
  const configuration = useContext(ConfigurationContext)
  const STATUS_COLORS = {
    CANCELLED: colors.orderUncomplete,
    REQUESTED: colors.textErrorColor,
    TRANSFERRED: colors.primary
  }
  return (
    <View style={[styles(colors).container, styles(colors).bgBlack]}>
      <TextDefault bold H4 textColor={colors.white}>
        {t('requestID')}{' '}
        <TextDefault bolder H4 textColor={colors.primary}>
          {item?.requestId}
        </TextDefault>{' '}
      </TextDefault>
      <View style={styles(colors).horizontalLine} />
      <RequestRow
        label={t('name')}
        value={item?.rider.name}
        color={colors.white}
        colors={colors}
      />
      <RequestRow
        label={t('email')}
        value={item?.rider.email}
        color={colors.white}
        colors={colors}
      />
      <RequestRow
        label={t('accountNumber')}
        value={item?.rider.accountNumber}
        color={colors.white}
        colors={colors}
      />
      <RequestRow
        label={t('requestAmount')}
        value={`${configuration.currencySymbol} ${item?.requestAmount.toFixed(
          2
        )}`}
        color={colors.white}
        colors={colors}
      />
      <RequestRow
        label={t('requestTime')}
        value={new Date(item?.requestTime).toDateString()}
        color={colors.white}
        colors={colors}
      />
      <RequestRow
        label={t('status')}
        value={item?.status}
        color={STATUS_COLORS[item?.status]}
        colors={colors}
      />
    </View>
  )
}

export const RequestRow = ({ label, value, color = colors.black, colors }) => {
  return (
    <View style={styles().requestDetails}>
      <TextDefault
        style={styles().col1}
        textColor={colors.fontSecondColor}
        bolder>
        {label}
      </TextDefault>
      <TextDefault style={styles().col2} textColor={color} bold>
        {value}
      </TextDefault>
    </View>
  )
}

export default RequestCard
