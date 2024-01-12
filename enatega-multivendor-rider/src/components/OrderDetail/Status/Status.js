import { Image, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import styles from './style'
import CustomColors from '../../../utilities/colors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import Tick from '../../../assets/svg/tick.png'
import Restaurant from '../../../assets/svg/restaurant.png'
import DeliveryBoy from '../../../assets/svg/DeliveryBoy.png'
import UserContext from '../../../context/user'
import { useTranslation } from 'react-i18next'

const formatTime = date =>
  new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' })

const Status = ({ orderData, itemId, pickedAt, deliveredAt, assignedAt }) => {
  const { t } = useTranslation()
  const { colors } = CustomColors()
  const STATUS_MESSAGES = {
    PICKED: {
      text: t('youPickedParcel'),
      subText: t('youPickedParcel')
    },
    // PROCESS: 'Your parcel is in process.',
    DELIVERED: {
      text: t('parcelDelivered'),
      subText: t('orderDelivered')
    },
    ACCEPTED: { text: t('newOrder'), subText: t('hurryUp') },
    // READY: 'Your parcel is ready.',
    ASSIGNED: {
      text: t('orderAssigned'),
      subText: t('orderAssignedSubText')
    },
    CANCELLED: {
      text: t('orderNotAvailable'),
      subText: t('orderNotAvailableSubText')
    }
  }

  const STATUS_ORDER = ['ASSIGNED', 'PICKED', 'DELIVERED']
  const { assignedOrders, loadingAssigned } = useContext(UserContext)
  const [order, setOrder] = useState(orderData)

  useEffect(() => {
    if (!loadingAssigned) {
      setOrder(assignedOrders.find(o => o._id === itemId))
    }
  }, [assignedOrders])
  if (!order) {
    return (
      <View style={styles(colors).container}>
        <View style={styles(colors).statusMessage}>
          <StatusMessage
            message={STATUS_MESSAGES.CANCELLED.text}
            subText={STATUS_MESSAGES.CANCELLED.subText}
            colors={colors}
          />
        </View>
      </View>
    )
  }
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).statusMessage}>
        <Icon
          name={
            order.orderStatus === 'ACCEPTED'
              ? Restaurant
              : ['PICKED', 'ASSIGNED'].includes(order.orderStatus)
              ? DeliveryBoy
              : Tick
          }
          colors={colors}
        />
        <StatusMessage
          message={STATUS_MESSAGES[order.orderStatus].text}
          subText={STATUS_MESSAGES[order.orderStatus].subText}
          colors={colors}
        />
      </View>
      <View style={styles().status}>
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(order.orderStatus) >= 0}
          status={STATUS_ORDER[0]}
          order={order}
          time={order.assignedAt ? formatTime(order.assignedAt) : null}
          colors={colors}
        />
        <View
          style={[
            styles().verticalLine,
            {
              backgroundColor:
                order.orderStatus === 'ASSIGNED' ? colors.primary : colors.white
            }
          ]}
        />
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(order.orderStatus) >= 1}
          status={STATUS_ORDER[1]}
          order={order}
          time={order.pickedAt ? formatTime(order.pickedAt) : null}
          colors={colors}
        />
        <View
          style={[
            styles().verticalLine,
            {
              backgroundColor:
                order.orderStatus === 'DELIVERED'
                  ? colors.primary
                  : colors.white
            }
          ]}
        />
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(order.orderStatus) >= 2}
          status={STATUS_ORDER[2]}
          time={order.deliveredAt ? formatTime(order.deliveredAt) : null}
          address={order.deliveryAddress.deliveryAddress}
          order={order}
          colors={colors}
        />
      </View>
    </View>
  )
}

const StatusRow = ({
  status,
  time,
  colors,
  address = null,
  order,
  fillColor = styles(colors).bgSecondary
}) => {
  return (
    <View style={styles().statusRow}>
      <View
        style={[
          styles().circle,
          fillColor ? styles(colors).bgPrimary : styles(colors).bgSecondary
        ]}
      />
      <View style={styles().statusOrder}>
        <TextDefault
          bolder
          H3
          textColor={fillColor ? colors.primary : colors.fontSecondColor}>
          {status}
        </TextDefault>
        {address !== null && (
          <TextDefault bold textColor={colors.fontSecondColor}>
            {address}
          </TextDefault>
        )}
      </View>
      <View style={styles().time}>
        <TextDefault bolder H5 textColor={colors.fontSecondColor}>
          {time}
        </TextDefault>
      </View>
    </View>
  )
}

const StatusMessage = ({ message, subText, colors }) => {
  return (
    <View style={styles().message}>
      <TextDefault bolder H3>
        {message}
      </TextDefault>
      <TextDefault bold H6 textColor={colors.fontSecondColor}>
        {subText}
      </TextDefault>
    </View>
  )
}

const Icon = ({ name, colors }) => {
  return (
    <View style={styles(colors).iconView}>
      <Image source={name} style={styles().icon} />
    </View>
  )
}

export default Status
