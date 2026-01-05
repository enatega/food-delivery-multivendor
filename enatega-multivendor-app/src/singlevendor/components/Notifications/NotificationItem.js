import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const NotificationItem = ({ notification, currentTheme, itemType = 'notification' }) => {
  // For notification type
  const getIconName = (type) => {
    const iconMap = {
      pickup: 'cube-outline',
      order: 'location-outline',
      payment: 'wallet-outline',
      promo: 'checkmark-circle-outline',
      rate: 'shield-outline',
      receipt: 'receipt-outline'
    }
    return iconMap[type] || 'notifications-outline'
  }

  const getIconShape = (type) => {
    // Some icons use square, some use circle
    const squareTypes = ['pickup', 'payment', 'rate', 'receipt']
    return squareTypes.includes(type) ? 'square' : 'circle'
  }

  // For order type
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'Ongoing': '#FFF9E6',
      'Order Delivered': '#E6F7E6',
      'Order Cancelled': '#FFE6E6'
    }
    return colorMap[status] || '#F5F5F5'
  }

  const getStatusTextColor = (status) => {
    const colorMap = {
      'Ongoing': '#B8860B',
      'Order Delivered': '#28A745',
      'Order Cancelled': '#DC3545'
    }
    return colorMap[status] || currentTheme.fontMainColor
  }

  // Render notification item
  if (itemType === 'notification') {
    const iconName = getIconName(notification.type)
    const iconShape = getIconShape(notification.type)

    return (
      <View style={styles(currentTheme).container}>
        <View
          style={[
            styles(currentTheme).iconContainer,
            iconShape === 'circle' && styles(currentTheme).iconContainerCircle
          ]}
        >
          <Ionicons
            name={iconName}
            size={scale(20)}
            color={currentTheme.fontSecondColor}
          />
        </View>
        <View style={styles(currentTheme).contentContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).description}
          >
            {notification.description}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={styles(currentTheme).timestamp}
          >
            {notification.timestamp}
          </TextDefault>
        </View>
      </View>
    )
  }

  // Render order item
  if (itemType === 'order') {
    const statusBadgeColor = getStatusBadgeColor(notification.status)
    const statusTextColor = getStatusTextColor(notification.status)
    const isOngoing = notification.status === 'Ongoing'

    return (
      <TouchableOpacity
        style={styles(currentTheme).orderContainer}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).orderContent}>
          {notification.image && (
            <Image
              source={notification.image}
              style={styles(currentTheme).orderImage}
              resizeMode="cover"
            />
          )}
          <View style={styles(currentTheme).orderDetails}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).orderName}
            >
              {notification.name}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
              style={styles(currentTheme).orderDate}
            >
              {notification.date}
            </TextDefault>
            <View style={styles(currentTheme).orderFooter}>
              <View
                style={[
                  styles(currentTheme).statusBadge,
                  { backgroundColor: statusBadgeColor }
                ]}
              >
                <TextDefault
                  textColor={statusTextColor}
                  style={styles(currentTheme).statusText}
                >
                  {notification.status}
                </TextDefault>
              </View>
            </View>
          </View>
          <View style={styles(currentTheme).orderRight}>
            <View style={styles(currentTheme).priceRow}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                style={styles(currentTheme).orderPrice}
              >
                {notification.price}
              </TextDefault>
              {!isOngoing && (
                <Ionicons
                  name="chevron-forward"
                  size={scale(20)}
                  color={currentTheme.fontSecondColor}
                  style={styles(currentTheme).chevron}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return null
}

const styles = (props = null) =>
  StyleSheet.create({
    // Notification styles
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(6),
      backgroundColor: props?.themeBackground
    },
    iconContainer: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(8),
      backgroundColor: props?.colorBgTertiary || '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12)
    },
    iconContainerCircle: {
      borderRadius: scale(20)
    },
    contentContainer: {
      flex: 1,
      paddingRight: scale(8)
    },
    description: {
      fontWeight: '500',
      fontSize: scale(14),
      lineHeight: scale(20),
      marginBottom: verticalScale(4)
    },
    timestamp: {
      fontSize: scale(12),
      lineHeight: scale(16)
    },
    // Order styles
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
    statusBadge: {
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: scale(4),
      marginRight: scale(8)
    },
    statusText: {
      fontSize: scale(11),
      fontWeight: '600'
    },
    progressBarContainer: {
      flex: 1,
      minWidth: scale(60),
      marginTop: verticalScale(4)
    },
    progressBar: {
      height: scale(2),
      backgroundColor: props?.gray200 || '#E5E7EB',
      borderRadius: scale(1),
      position: 'relative',
      overflow: 'visible',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    progressIndicator: {
      position: 'absolute',
      left: '30%',
      top: -scale(4),
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: props?.primary || '#007AFF'
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
      fontSize: scale(16),
      lineHeight: scale(22)
    },
    chevron: {
      marginLeft: scale(4)
    }
  })

export default NotificationItem

