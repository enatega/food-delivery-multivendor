import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const NotificationItem = ({ notification, currentTheme, itemType = 'notification' }) => {
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
    const squareTypes = ['pickup', 'payment', 'rate', 'receipt']
    return squareTypes.includes(type) ? 'square' : 'circle'
  }

  if (itemType !== 'notification') {
    return null
  }

  const themedStyles = styles(currentTheme)
  const iconName = getIconName(notification.type)
  const iconShape = getIconShape(notification.type)

  return (
    <View style={themedStyles.container}>
      <View
        style={[
          themedStyles.iconContainer,
          iconShape === 'circle' && themedStyles.iconContainerCircle
        ]}
      >
        <Ionicons
          name={iconName}
          size={scale(20)}
          color={currentTheme.fontSecondColor}
        />
      </View>
      <View style={themedStyles.contentContainer}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={themedStyles.description}
        >
          {notification.description}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
          style={themedStyles.timestamp}
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

