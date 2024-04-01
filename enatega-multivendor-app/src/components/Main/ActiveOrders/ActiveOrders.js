import React, { useContext, useState, useEffect } from 'react'
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
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { calulateRemainingTime } from '../../../utils/customFunctions'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']

const ActiveOrders = ({ onActiveOrdersChange }) => {
  const { t } = useTranslation()
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const activeOrders = orders.filter(o =>
    orderStatusActive.includes(o.orderStatus)
  )
  const onPressDetails = order => {
    navigation.navigate('OrderDetail', {
      _id: order._id,
      currencySymbol: configuration.currencySymbol
    })
  }

  const [showAll, setShowAll] = useState(false)

  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 2)

  useEffect(() => {
    const hasActiveOrders = displayOrders.length > 0
    onActiveOrdersChange(hasActiveOrders)
  }, [displayOrders, onActiveOrdersChange])

  if (loadingOrders) return null
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  if (!displayOrders.length) return null
  const order = displayOrders[0]
  const remainingTime = calulateRemainingTime(order)
  const modalStyle = {
    borderWidth: StyleSheet.hairlineWidth,  
    backgroundColor: currentTheme.themeBackground,
   
  };

  return (
    <Modalize alwaysOpen={MODAL_HEIGHT} withHandle={false} modalHeight={MODAL_HEIGHT} modalStyle={modalStyle}>
      <View style={{ marginTop: scale(20), marginHorizontal: scale(10) }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <TextDefault Regular textColor={currentTheme.fontGrayNew}>{t('estimatedDeliveryTime')}</TextDefault>
          <TouchableOpacity onPress={() => onPressDetails(order)}>
            <TextDefault textColor={currentTheme.gray700} bolder>{t('details')}</TextDefault>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: scale(10) }}>
          <TextDefault Regular textColor={currentTheme.gray900} H1 bolder>
            {remainingTime}-{remainingTime + 5} {t('mins')}
          </TextDefault>
        </View>
        <View>
          <ProgressBar
            configuration={configuration}
            currentTheme={currentTheme}
            item={order}
            navigation={navigation}
          />
          <View style={{ marginTop: scale(10) }}>
            <TextDefault
              numberOfLines={2}
              style={styles(currentTheme).statusText}>
              {t(checkStatus(order.orderStatus).statusText)}
            </TextDefault>
          </View>
        </View>
      </View>
    </Modalize>
    
  )
}

export default ActiveOrders
