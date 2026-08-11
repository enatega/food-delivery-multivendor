import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import TextDefault from '../../../../components/Text/TextDefault/TextDefault'

const parseDate = value => {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null
  }

  let candidate = value
  if (candidate && typeof candidate === 'object') {
    candidate = candidate.$date ?? candidate.date ?? candidate.value
  }
  if (typeof candidate === 'string' && /^\d+$/.test(candidate)) {
    candidate = Number(candidate)
  }
  if (typeof candidate === 'number' && candidate < 1e12) {
    candidate *= 1000
  }

  const date = candidate ? new Date(candidate) : null
  return date && Number.isFinite(date.getTime()) ? date : null
}

const formatTime = value => parseDate(value)?.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit'
}) || null

const DeliveryTimeBanner = ({ eta, orderStatus, riderLocation, isPickUpOrder = false }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const windowStart = formatTime(eta?.windowStartAt)
  const windowEnd = formatTime(eta?.windowEndAt)
  const windowLabel = windowStart && windowEnd
    ? `${windowStart}–${windowEnd}`
    : (t('calculating', { defaultValue: 'Calculating…' }))
  const isInTransit = ['PICKED', 'ON_ROUTE'].includes(orderStatus)
  const locationTimestamp = parseDate(riderLocation?.recordedAt || eta?.lastLocationAt)
  const stale = isInTransit && locationTimestamp && Date.now() - locationTimestamp.getTime() > 90000
  const readyAt = parseDate(eta?.readyAt)
  const preparingLate = ['ACCEPTED', 'ASSIGNED'].includes(orderStatus) && readyAt && Date.now() > readyAt.getTime()
  const expectedReadyText = readyAt
    ? ` — ${t('expected ready by', { defaultValue: 'expected ready by' })} ${formatTime(readyAt)}`
    : ''
  const statusText = stale
    ? `${t('Rider location temporarily unavailable', { defaultValue: 'Rider location temporarily unavailable' })} — ${t('last updated', { defaultValue: 'last updated' })} ${formatTime(locationTimestamp)}`
    : preparingLate
      ? orderStatus === 'ASSIGNED'
        ? t('Your rider is collecting the order. Preparation is taking a little longer.', { defaultValue: 'Your rider is collecting the order. Preparation is taking a little longer.' })
        : t('Preparation is taking a little longer.', { defaultValue: 'Preparation is taking a little longer.' })
      : isInTransit
        ? t('Your order is on the way.', { defaultValue: 'Your order is on the way.' })
        : orderStatus === 'ASSIGNED'
          ? t('Your order is being prepared and a rider has been assigned.', { defaultValue: 'Your order is being prepared and a rider has been assigned.' })
          : orderStatus === 'ACCEPTED'
            ? isPickUpOrder
              ? `${t('Your order is being prepared for collection', { defaultValue: 'Your order is being prepared for collection' })}${expectedReadyText}`
              : `${t('Your order is being prepared', { defaultValue: 'Your order is being prepared' })}${expectedReadyText}`
            : ['DELIVERED', 'COMPLETED'].includes(orderStatus)
                ? isPickUpOrder
                  ? t('Your order has been collected.', { defaultValue: 'Your order has been collected.' })
                  : t('Your order has been delivered.', { defaultValue: 'Your order has been delivered.' })
                : ['CANCELLED', 'CANCELLEDBYREST'].includes(orderStatus)
                    ? t('This order has been cancelled.', { defaultValue: 'This order has been cancelled.' })
                    : t('We’re updating your order status.', { defaultValue: 'We’re updating your order status.' })

  const title = isPickUpOrder
    ? t('Estimated collection time', { defaultValue: 'Estimated collection time' })
    : isInTransit
      ? t('Estimated arrival', { defaultValue: 'Estimated arrival' })
      : t('Estimated delivery time', { defaultValue: 'Estimated delivery time' })

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault textColor='#fff' h5 isRTL bold>
        {title}
      </TextDefault>
      <TextDefault textColor='#fff' H3 bolder isRTL style={styles().timeText}>
        {windowLabel}
      </TextDefault>
      <TextDefault textColor='#fff' small isRTL style={styles().statusText}>{statusText}</TextDefault>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      backgroundColor: props?.singlevendorcolor || '#0090CD',
      paddingVertical: scale(14),
      paddingHorizontal: scale(16),
      alignItems: 'center',
      borderRadius: scale(12),
      marginHorizontal: scale(16),
      marginTop: scale(8)
    },
    timeText: {
      marginTop: scale(2)
    },
    statusText: {
      marginTop: scale(5),
      opacity: 0.9,
      textAlign: 'center'
    }
  })

export default DeliveryTimeBanner
