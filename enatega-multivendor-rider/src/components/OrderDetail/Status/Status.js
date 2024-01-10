import { Image, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import styles from './style'
import colors from '../../../utilities/colors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import Tick from '../../../assets/svg/tick.png'
import Restaurant from '../../../assets/svg/restaurant.png'
import DeliveryBoy from '../../../assets/svg/DeliveryBoy.png'
import UserContext from '../../../context/user'
import {useTranslation} from 'react-i18next'

/*const STATUS_MESSAGES = {
  PICKED: {
    text: i18n.t('youPickedParcel'),
    subText: i18n.t('youPickedParcel')
  },
  // PROCESS: 'Your parcel is in process.',
  DELIVERED: {
    text: i18n.t('parcelDelivered'),
    subText: i18n.t('orderDelivered')
  },
  ACCEPTED: { text: i18n.t('newOrder'), subText: i18n.t('hurryUp') },
  // READY: 'Your parcel is ready.',
  ASSIGNED: {
    text: i18n.t('orderAssigned'),
    subText: i18n.t('orderAssignedSubText')
  },
  CANCELLED: {
    text: i18n.t('orderNotAvailable'),
    subText: i18n.t('orderNotAvailableSubText')
  }
}

const STATUS_ORDER = ['ASSIGNED', 'PICKED', 'DELIVERED']*/
const formatTime = date =>
  new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' })

const Status = ({ orderData, itemId, pickedAt, deliveredAt, assignedAt }) => {
  const {t} = useTranslation()
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
  
  const STATUS_ORDER = [t('ASSIGNED'), t('PICKED'), t('DELIVERED')]
  const { assignedOrders, loadingAssigned } = useContext(UserContext)
  const [order, setOrder] = useState(orderData)

  useEffect(() => {
    if (!loadingAssigned) {
      setOrder(assignedOrders.find(o => o._id === itemId))
    }
  }, [assignedOrders])
  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.statusMessage}>
          <StatusMessage
            message={STATUS_MESSAGES.CANCELLED.text}
            subText={STATUS_MESSAGES.CANCELLED.subText}
          />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.statusMessage}>
        <Icon
          name={
            order.orderStatus === 'ACCEPTED'
              ? Restaurant
              : ['PICKED', 'ASSIGNED'].includes(order.orderStatus)
              ? DeliveryBoy
              : Tick
          }
        />
        <StatusMessage
          message={STATUS_MESSAGES[order.orderStatus].text}
          subText={STATUS_MESSAGES[order.orderStatus].subText}
        />
      </View>
      <View style={styles.status}>
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(t(order.orderStatus)) >= 0}
          status={STATUS_ORDER[0]}
          order={order}
          time={order.assignedAt ? formatTime(order.assignedAt) : null}
        />
        <View
          style={[
            styles.verticalLine,
            {
              backgroundColor:
                t(order.orderStatus) === t('ASSIGNED') ? colors.primary : colors.white
            }
          ]}
        />
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(t(order.orderStatus)) >= 1}
          status={STATUS_ORDER[1]}
          order={order}
          time={order.pickedAt ? formatTime(order.pickedAt) : null}
        />
        <View
          style={[
            styles.verticalLine,
            {
              backgroundColor:
                t(order.orderStatus) === t('DELIVERED')
                  ? colors.primary
                  : colors.white
            }
          ]}
        />
        <StatusRow
          fillColor={STATUS_ORDER.indexOf(t(order.orderStatus)) >= 2}
          status={STATUS_ORDER[2]}
          time={order.deliveredAt ? formatTime(order.deliveredAt) : null}
          address={order.deliveryAddress.deliveryAddress}
          order={order}
        />
      </View>
    </View>
  )
}

const StatusRow = ({
  status,
  time,
  address = null,
  order,
  fillColor = styles.bgSecondary
}) => {
  return (
    <View style={styles.statusRow}>
      <View
        style={[
          styles.circle,
          fillColor ? styles.bgPrimary : styles.bgSecondary
        ]}
      />
      <View style={styles.statusOrder}>
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
      <View style={styles.time}>
        <TextDefault bolder H5 textColor={colors.fontSecondColor}>
          {time}
        </TextDefault>
      </View>
    </View>
  )
}

const StatusMessage = ({ message, subText }) => {
  return (
    <View style={styles.message}>
      <TextDefault bolder H3>
        {message}
      </TextDefault>
      <TextDefault bold H6 textColor={colors.fontSecondColor}>
        {subText}
      </TextDefault>
    </View>
  )
}

const Icon = ({ name }) => {
  return (
    <View style={styles.iconView}>
      <Image source={name} style={styles.icon} />
    </View>
  )
}

export default Status
