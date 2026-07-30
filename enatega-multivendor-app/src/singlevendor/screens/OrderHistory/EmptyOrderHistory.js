import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const EmptyOrderHistory = ({ currentTheme, onStartShopping }) => {
  const { t } = useTranslation()
  const themedStyles = styles(currentTheme)

  return (
    <View style={themedStyles.container}>
      <Image
        source={require('../../assets/images/empty_OrderHistory.png')}
        style={themedStyles.image}
        resizeMode="contain"
      />

      <TextDefault textColor={currentTheme?.fontMainColor} style={themedStyles.title} bolder center>
        {t('unReadOrders') || 'No orders yet'}
      </TextDefault>

      <TextDefault textColor={currentTheme?.fontSecondColor} style={themedStyles.description} center>
        {t("You haven't made any order. It will show here when you made one.") ||
          "You haven't made any order. It will show here when you made one."}
      </TextDefault>

      <TouchableOpacity
        activeOpacity={0.8}
        style={themedStyles.button}
        onPress={onStartShopping}
      >
        <TextDefault textColor={currentTheme?.colorTextPrimary || '#3A98C9'} bold center>
          {t('Start shopping') || 'Start shopping'}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(96),
      backgroundColor: props?.toggler || '#FFF'
    },
    image: {
      width: scale(190),
      height: scale(180),
      marginBottom: verticalScale(22)
    },
    title: {
      fontSize: scale(20),
      marginBottom: verticalScale(10)
    },
    description: {
      fontSize: scale(12),
      lineHeight: scale(20),
      textAlign: 'center',
      maxWidth: scale(260),
      marginBottom: verticalScale(24)
    },
    button: {
      backgroundColor: props?.colorBgSecondary || '#CCE9F5',
      minWidth: scale(300),
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(14),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export default EmptyOrderHistory
