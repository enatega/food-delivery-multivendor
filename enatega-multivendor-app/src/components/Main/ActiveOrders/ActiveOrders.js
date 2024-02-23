import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useNavigation } from '@react-navigation/native'
import TextError from '../../Text/TextError/TextError'
import OrdersContext from '../../../context/Orders'
import Spinner from '../../Spinner/Spinner'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { Modalize } from 'react-native-modalize'
import { ProgressBar, checkStatus } from './ProgressBar'
import styles from './styles'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']

const ActiveOrders = () => {
  const { t } = useTranslation()
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const activeOrders = orders.filter(o =>
    orderStatusActive.includes(o.orderStatus)
  )
  const onPressDetails = (order) => {
    navigation.navigate('OrderDetail', {
      _id: order._id,
      currencySymbol: configuration.currencySymbol
    })
  }

  const [showAll, setShowAll] = useState(false)

  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 2)

  if (loadingOrders) return <Spinner />
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  if (!displayOrders.length) return null
  const order = displayOrders[0]
  const remainingTime = Math.floor((order.completionTime - Date.now()) / 1000 / 60)
  console.log('remainingTime', remainingTime, order.completionTime)

  return (
    <Modalize alwaysOpen={MODAL_HEIGHT} withHandle={false} modalHeight={MODAL_HEIGHT} modalStyle={{ borderWidth: StyleSheet.hairlineWidth }}>
      <View style={{ marginTop: scale(20), marginHorizontal: scale(10) }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <TextDefault Regular textColor={currentTheme.gray600}>Estimated delivery time</TextDefault>
          <TouchableOpacity onPress={() => onPressDetails(order)}>
            <TextDefault textColor={currentTheme.gray700} bolder>Details</TextDefault>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: scale(10) }}>
          <TextDefault Regular textColor={currentTheme.gray900} H1 bolder>15-25 mins</TextDefault>
        </View>
        <View>
          <ProgressBar
            configuration={configuration}
            currentTheme={currentTheme}
            item={order}
            navigation={navigation}
          />
          <View style={{ marginTop: scale(10) }}>
            <TextDefault numberOfLines={2} style={styles(currentTheme).statusText}>
              {t(checkStatus(order.orderStatus).statusText)}
            </TextDefault>
          </View>
        </View>
      </View>
    </Modalize>
  )
}

export default ActiveOrders
