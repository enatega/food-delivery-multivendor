import React, { useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const OrderHistoryItem = ({ ordersData, currentTheme, onOrderPress }) => {
  const themedStyles = styles(currentTheme)
  const [orders,setorders] = useState(ordersData)
console.log('orders__Images', JSON.stringify(orders,null,2))
  // Render section header rows
  if (orders.type === 'header') {
    return (
      <View style={themedStyles.sectionHeader}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={themedStyles.sectionHeaderText}
          bolder
        >
          {orders.title}
        </TextDefault>
      </View>
    )
  }

  // Render regular order rows
  const isOngoing = orders.status === 'Ongoing'

  const getStatusBadgeStyle = (status) => {
    console.log('orders__status',status)
    switch (status) {
      case 'Pending':
        return themedStyles.statusBadgeOngoing
      case 'Order Delivered':
        return themedStyles.statusBadgeDelivered
      case 'Order Cancelled':
        return themedStyles.statusBadgeCancelled
      case 'Refunded':
        return themedStyles.statusBadgeRefunded
      case 'Scheduled':
        return themedStyles.statusBadgeScheduled
      default:
        return themedStyles.statusBadgeDefault
    }
  }

  const getStatusTextColor = (status) => {
    const colorMap = {
      'Ongoing': '#B8860B',
      'Pending': '#B8860B',
      'Order Delivered': '#28A745',
      'Order Cancelled': '#DC3545',
      'Refunded': currentTheme.primaryBlue || currentTheme.primary || '#0EA5E9',
      'Scheduled': '#0EA5E9'
    }
    return colorMap[status] || currentTheme.fontMainColor
  }

  return (
    <TouchableOpacity
      style={themedStyles.orderContainer}
      activeOpacity={0.7}
      onPress={() => onOrderPress && onOrderPress(orders)}
    >
      <View style={themedStyles.orderContent}>
        {orders.image && (
          <Image
            source={orders.image}
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
            {orders.name}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={themedStyles.orderDate}
            bold
          >
            {orders.date}
          </TextDefault>
          <View style={themedStyles.orderFooter}>
            <View
              style={[
                themedStyles.statusBadgeBase,
                getStatusBadgeStyle(orders.status)
              ]}
            >
              <TextDefault
                textColor={getStatusTextColor(orders.status)}
                style={themedStyles.statusText}
                bold
              >
                {orders.status}
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
              {orders.price}
            </TextDefault>
            {!isOngoing && (
              <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color={currentTheme.fontMainColor}
                style={themedStyles.chevron}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    sectionHeader: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(8),
      backgroundColor: props?.themeBackground
    },
    sectionHeaderText: {
      fontSize: scale(18),
      fontWeight: '600',
      lineHeight: scale(20)
    },
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
    statusBadgeOngoing: {
      backgroundColor: '#FFF9E6'
    },
    statusBadgeDelivered: {
      backgroundColor: '#E6F7E6'
    },
    statusBadgeCancelled: {
      backgroundColor: '#FFE6E6'
    },
    statusBadgeRefunded: {
      backgroundColor: props?.lowOpacityBlue || 'rgba(14, 165, 233, 0.2)'
    },
    statusBadgeScheduled: {
      backgroundColor: props?.lowOpacityBlue || 'rgba(14, 165, 233, 0.2)'
    },
    statusBadgeDefault: {
      backgroundColor: '#F5F5F5'
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
      // fontSize: scale(16),
      lineHeight: scale(22)
    },
    chevron: {
      marginLeft: scale(4)
    }
  })

export default OrderHistoryItem


