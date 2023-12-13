import { View, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import { TabsContext } from '../../context/tabs'
import UserContext from '../../context/user'
import {useTranslation} from 'react-i18next'

const Tabs = props => {
  const {t} = useTranslation()
  const { active } = useContext(TabsContext)
  const { assignedOrders } = useContext(UserContext)
  const [ordersLength, setOrderslength] = useState(
    assignedOrders?.filter(
      o => o.orderStatus === 'ACCEPTED' && !o.rider && !o.isPickedUp
    ).length
  )
  const [myOrdersLength, setMyOrderslength] = useState(
    assignedOrders?.filter(
      o =>
        (o.orderStatus === 'ASSIGNED' || o.orderStatus === 'PICKED') &&
        !o.isPickedUp
    ).length
  )

  useEffect(() => {
    setOrderslength(
      assignedOrders?.filter(
        o => o.orderStatus === 'ACCEPTED' && !o.rider && !o.isPickedUp
      ).length
    )
    setMyOrderslength(
      assignedOrders?.filter(
        o =>
          (o.orderStatus === 'ASSIGNED' || o.orderStatus === 'PICKED') &&
          !o.isPickedUp
      ).length
    )
  }, [assignedOrders])

  return (
    <View style={styles.container}>
      {active === 'MyOrders' && (
        <View style={styles.badge}>
          <TextDefault textColor={colors.black}>
            {ordersLength > 0 ? ordersLength : 0}
          </TextDefault>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('Home')}
        style={[
          styles.row,
          active === 'NewOrders' && styles.btn,
          { width: '40%' }
        ]}>
        <TextDefault
          bolder
          H5
          textColor={active === 'NewOrders' ? colors.black : colors.white}>
          {t('NewOrders')}
        </TextDefault>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('MyOrders')}
        style={[
          styles.row,
          active === 'MyOrders' && styles.btn,
          { width: '45%' }
        ]}>
        <TextDefault
          bolder
          H5
          textColor={active === 'MyOrders' ? colors.black : colors.white}>
          {t('myorders')}
        </TextDefault>
        {active === 'NewOrders' && (
          <View style={styles.rightBadge}>
            <TextDefault textColor={colors.black}>
              {myOrdersLength > 0 ? myOrdersLength : 0}
            </TextDefault>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default Tabs
