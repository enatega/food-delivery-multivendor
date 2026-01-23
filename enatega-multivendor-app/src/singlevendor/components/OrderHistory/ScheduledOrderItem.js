import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'
import { formatOrderDate } from '../../utils/orderHistoryHelpers'

const ScheduledOrderItem = ({ order, currentTheme, currencySymbol, onOrderPress }) => {
  const themedStyles = styles(currentTheme)

  // Format order data
  const orderName = order.orderId || order.restaurant?.name || 'Order'
  const dateSource = order.expectedTime || order.preparationTime || order.orderDate || order.createdAt
  const formattedDate = formatOrderDate(dateSource)
  const amount = Number.parseFloat(order.orderAmount || 0)
  const formattedPrice = `${currencySymbol} ${amount.toFixed(2)}`
  const orderImage = order.restaurant?.image ? { uri: order.restaurant.image } : null

  return (
    <TouchableOpacity
      style={themedStyles.orderContainer}
      activeOpacity={0.7}
      onPress={() => onOrderPress && onOrderPress(order)}
    >
      <View style={themedStyles.orderContent}>
        {orderImage && (
          <Image
            source={orderImage}
            style={themedStyles.orderImage}
            resizeMode="cover"
          />
        )}
        <View style={themedStyles.orderDetails}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={themedStyles.orderName}
            bold
          >
            {orderName}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={themedStyles.orderDate}
            bold
          >
            {formattedDate}
          </TextDefault>
          <View style={themedStyles.orderFooter}>
            <View
              style={[
                themedStyles.statusBadgeBase,
                themedStyles.statusBadgeScheduled
              ]}
            >
              <TextDefault
                textColor="#0EA5E9"
                style={themedStyles.statusText}
                bold
              >
                Scheduled
              </TextDefault>
            </View>
          </View>
        </View>
        <View style={themedStyles.orderRight}>
          <View style={themedStyles.priceRow}>
            <TextDefault
              h4
              textColor={currentTheme.fontMainColor}
              style={themedStyles.orderPrice}
              bolder
            >
              {formattedPrice}
            </TextDefault>
            <Ionicons
              name="chevron-forward"
              size={scale(20)}
              color={currentTheme.fontMainColor}
              style={themedStyles.chevron}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    orderContainer: {
      backgroundColor: props?.themeBackground,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12)
    },
    orderContent: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    orderImage: {
      width: scale(60),
      height: scale(60),
      borderRadius: scale(8),
      marginRight: scale(12),
      backgroundColor: props?.colorBgTertiary || '#F5F5F5'
    },
    orderDetails: {
      flex: 1,
      marginRight: scale(8)
    },
    orderName: {
      fontWeight: '600',
      fontSize: scale(16),
      lineHeight: scale(22),
      marginBottom: verticalScale(4)
    },
    orderDate: {
      fontSize: scale(12),
      lineHeight: scale(16),
      marginBottom: verticalScale(8)
    },
    orderFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    statusBadgeBase: {
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: scale(4),
      marginRight: scale(8)
    },
    statusBadgeScheduled: {
      backgroundColor: props?.lowOpacityBlue || 'rgba(14, 165, 233, 0.2)'
    },
    statusText: {
      fontSize: scale(11),
      fontWeight: '600'
    },
    orderRight: {
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      minHeight: scale(60)
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    orderPrice: {
      fontWeight: '600',
      lineHeight: scale(22)
    },
    chevron: {
      marginLeft: scale(4)
    }
  })

export default ScheduledOrderItem
