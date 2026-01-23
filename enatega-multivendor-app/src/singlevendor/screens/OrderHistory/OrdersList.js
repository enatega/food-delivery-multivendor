import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ScheduledOrdersList from '../../components/OrderHistory/ScheduledOrdersList'

const OrdersList = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const handleOrderPress = (orderItem) => {
    console.log('Scheduled orderItem', JSON.stringify(orderItem, null, 2))
    navigation.navigate('OrderConfirmation', { orderId: orderItem?.id })
  }

  return (
    <View style={styles(currentTheme).container}>
      <ScheduledOrdersList
        onOrderPress={handleOrderPress}
        currentTheme={currentTheme}
      />
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props?.themeBackground
    }
  })

export default OrdersList