import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const NotificationItem = ({ notification, currentTheme }) => {
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

const styles = (props = null) =>
  StyleSheet.create({
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
    }
  })

export default NotificationItem

