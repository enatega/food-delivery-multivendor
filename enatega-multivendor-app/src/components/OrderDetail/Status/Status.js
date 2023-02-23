import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import Rider from '../../../assets/SVG/rider'
import ArrowsLoading from '../../../assets/SVG/arrows-loading'
import RestaurantPreparing from '../../../assets/SVG/restaurant-preparing'
import OrderDelivered from '../../../assets/SVG/order-delivered'

const STATUS_MESSAGES = {
  PENDING: 'Waiting for restaurant to accept',
  ACCEPTED: 'Food is being prepared',
  ASSIGNED: 'Assigned a rider',
  PICKED: 'Rider on his way',
  DELIVERED: 'Thank you!',
  CANCELLED: "We're sorry, Your order was cancelled."
}
const STATUS_ORDER = [
  'PENDING',
  'ACCEPTED',
  'ASSIGNED',
  'PICKED',
  'DELIVERED',
  'CANCELLED'
]

const formatTime = date =>
  new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' })

export default function Status({
  theme,
  orderStatus = 'CANCELLED',
  createdAt,
  acceptedAt,
  pickedAt,
  deliveredAt,
  cancelledAt,
  assignedAt
}) {
  return (
    <View style={styles.container(theme)}>
      <View style={styles.statusBox(theme)}>
        <Circle color={theme.white} size={60} style={styles.icon}>
          {orderStatus === 'PENDING' && <ArrowsLoading />}
          {orderStatus === 'ACCEPTED' && <RestaurantPreparing />}
          {orderStatus === 'ASSIGNED' && <Rider />}
          {orderStatus === 'PICKED' && <Rider />}
          {orderStatus === 'DELIVERED' && <OrderDelivered />}
          {orderStatus === 'CANCELLED' && <ArrowsLoading />}
        </Circle>
        <View style={styles.statusText}>
          <TextDefault
            style={styles.text}
            H4
            textColor={theme.fontWhite}
            bolder>
            Your order is {orderStatus.toLowerCase()}
          </TextDefault>
          <TextDefault
            style={styles.text}
            small
            textColor={theme.secondaryText}>
            {STATUS_MESSAGES[orderStatus]}
          </TextDefault>
        </View>
      </View>
      <View style={styles.statusList(theme)}>
        {orderStatus === 'CANCELLED' && (
          <StatusRow
            theme={theme}
            isEta={false}
            number={1}
            status={'Cancelled'}
            time={formatTime(cancelledAt)}
            showLine={false}
          />
        )}
        {orderStatus !== 'CANCELLED' && (
          <>
            <StatusRow
              theme={theme}
              isEta={false}
              number={1}
              status={'Order palced'}
              time={formatTime(createdAt)}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 1}
              number={2}
              status={'Accepted'}
              time={acceptedAt ? formatTime(acceptedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 2}
              number={3}
              status={'Assigned'}
              time={assignedAt ? formatTime(assignedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 3}
              number={4}
              status={'Picked'}
              time={pickedAt ? formatTime(pickedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 4}
              number={5}
              status={'Delivered'}
              time={deliveredAt ? formatTime(deliveredAt) : '--:--'}
              showLine={false}
            />
          </>
        )}
      </View>
    </View>
  )
}

const Circle = ({ children, color, size, style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          borderRadius: size / 2,
          width: size,
          height: size
        },
        style
      ]}>
      {children}
    </View>
  )
}

const StatusRow = ({ theme, number, status, time, isEta, showLine }) => {
  return (
    <View>
      <View style={styles.statusRow}>
        <Circle
          style={styles.icon}
          color={isEta ? theme.statusSecondColor : theme.main}
          size={30}>
          <TextDefault>{number}</TextDefault>
        </Circle>
        <View style={styles.statusTimeContainer}>
          <TextDefault
            style={styles.statusRowText}
            textColor={theme.main}
            bolder>
            {status}
          </TextDefault>
          <TextDefault textColor={theme.secondaryText} bold>
            {isEta ? 'ETA ' : ''}
            {time}
          </TextDefault>
        </View>
      </View>
      {showLine && (
        <View
          style={{
            marginLeft: 15,
            height: 20,
            width: 1,
            backgroundColor: theme.main
          }}></View>
      )}
    </View>
  )
}
