import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import Rider from '../../../assets/SVG/rider'
import ArrowsLoading from '../../../assets/SVG/arrows-loading'
import RestaurantPreparing from '../../../assets/SVG/restaurant-preparing'
import OrderDelivered from '../../../assets/SVG/order-delivered'
import {useTranslation} from 'react-i18next'

const STATUS_MESSAGES = {
  PENDING: 'PENDINGStatusMessage',
  ACCEPTED: 'ACCEPTEDStatusMessage',
  ASSIGNED: 'ASSIGNEDStatusMessage',
  PICKED: 'PICKEDStatusMessage',
  DELIVERED: 'DELIVEREDStatusMessage',
  CANCELLED: "CANCELLEDStatusMessage",
  CANCELLEDBYREST:"CANCELLEDStatusMessage"
  
}
const STATUS_ORDER = [
  'PENDING',
  'ACCEPTED',
  'ASSIGNED',
  'PICKED',
  'DELIVERED',
  'CANCELLED',
  'CANCELLEDBYREST'
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
  const {t} = useTranslation()
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
            {t('yourOrderIs')} {t(orderStatus).toLowerCase()}
          </TextDefault>
          <TextDefault
            style={styles.text}
            small
            textColor={theme.secondaryText}>
            {t(STATUS_MESSAGES[orderStatus])}
          </TextDefault>
        </View>
      </View>
      <View style={styles.statusList(theme)}>
        {orderStatus === 'CANCELLED'  && (
          <StatusRow
            theme={theme}
            isEta={false}
            number={1}
            status={'Cancelled'}
            time={formatTime(cancelledAt)}
            showLine={false}
          />
        )}
        {orderStatus ===  'CANCELLEDBYREST' && (
          <StatusRow
            theme={theme}
            isEta={false}
            number={1}
            status={'CANCELLEDBYREST'}
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
              status={t('statusOrderPalced')}
              time={formatTime(createdAt)}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 1}
              number={2}
              status={t('statusAccepted')}
              time={acceptedAt ? formatTime(acceptedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 2}
              number={3}
              status={t('statusAssigned')}
              time={assignedAt ? formatTime(assignedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 3}
              number={4}
              status={t('statusPicked')}
              time={pickedAt ? formatTime(pickedAt) : '--:--'}
              showLine={true}
            />
            <StatusRow
              theme={theme}
              isEta={STATUS_ORDER.indexOf(orderStatus) < 4}
              number={5}
              status={t('statusDelivered')}
              time={deliveredAt ? formatTime(deliveredAt) : '--:--'}
              showLine={false}
            />
          </>
        )}
      </View>
      <View style={styles.line2(theme)}></View>
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

  const {t} = useTranslation()

  return (
    <View style={{backgroundColor: theme.themeBackground}}>
      <View style={styles.statusRow}>
        <Circle
          style={styles.icon}
          color={isEta ? theme.statusSecondColor : theme.main}
          size={30}>
          <TextDefault>{number}</TextDefault>
        </Circle>
        <View style={styles.statusTimeContainer}>
          {/* <TextDefault
            style={styles.statusRowText}
            textColor={theme.main}
            bolder>
            {status}
          </TextDefault> */}
          
          {/* <TextDefault textColor={theme.secondaryText} bold>
            {isEta ? t('ETA') : ''}
            {time}
          </TextDefault> */}

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
