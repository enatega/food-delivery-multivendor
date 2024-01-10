import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import useOrder from './useOrder'
import Spinner from '../Spinner/Spinner'
import {useTranslation} from 'react-i18next'


const Order = ({ order, orderAmount }) => {
  const {
    active,
    navigation,
    time,
    mutateAssignOrder,
    loadingAssignOrder
  } = useOrder(order)

    const {t} = useTranslation()
  return (
    <>
      <View style={{ marginTop: 20 }}>
        {order?.orderStatus === 'ACCEPTED' ||
        order?.orderStatus === 'PICKED' ? (
          <View
            style={[
              styles.badge,
              active === 'MyOrders' ? styles.bgRed : styles.bgBlack
            ]}
          />
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.container,
            active === 'NewOrders' ? styles.bgPrimary : styles.bgWhite
          ]}
          onPress={() =>
            navigation.navigate('OrderDetail', {
              itemId: order?._id,
              order
            })
          }>
          <View style={styles.row}>
            <TextDefault style={styles.rowItem1} bolder H4>
              {t('orderID')}
            </TextDefault>
            <TextDefault style={styles.rowItem2} bolder H4>
              {order?.orderId}
            </TextDefault>
          </View>
          <View style={styles.row}>
            <TextDefault
              style={styles.rowItem1}
              bolder
              H5
              textColor={colors.fontSecondColor}>
              {t('orderAmount')}
            </TextDefault>
            <TextDefault style={styles.rowItem2} bolder H5>
              {orderAmount}
            </TextDefault>
          </View>
          <View style={styles.row}>
            <TextDefault
              style={styles.rowItem1}
              bolder
              H5
              textColor={colors.fontSecondColor}>
              {t('paymentMethod')}
            </TextDefault>
            <TextDefault style={styles.rowItem2} bolder H5>
              {order?.paymentMethod}
            </TextDefault>
          </View>
          {active === 'MyOrders' && (
            <View style={styles.row}>
              <TextDefault
                style={styles.rowItem1}
                bolder
                H5
                textColor={colors.fontSecondColor}>
                {t('deliveryTime')}
              </TextDefault>
              <TextDefault style={styles.rowItem2} bolder H5>
                {new Date(order?.createdAt).toLocaleDateString()}{' '}
                {new Date(order?.createdAt).toLocaleTimeString()}
              </TextDefault>
            </View>
          )}
          <View style={styles.horizontalLine} />
          <View style={styles.row}>
            {active === 'NewOrders' && (
              <View style={[styles.row, styles.rowItem1, styles.timeLeft]}>
                <TextDefault bold H6 textColor={colors.fontSecondColor}>
                  {t('timeLeft')}
                </TextDefault>
                <TextDefault bolder H2 style={styles.time}>
                  {time}
                </TextDefault>
              </View>
            )}
            {active === 'MyOrders' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.rowItem2,
                  styles.btn,
                  active === 'MyOrders' && styles.paddingBottom
                ]}
                disabled>
                <TextDefault bolder center textColor={colors.primary}>
                  {order?.orderStatus === 'DELIVERED'
                    ? t('DELIVERED')
                    : t('inProgress')}
                </TextDefault>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.rowItem2,
                  styles.btn,
                  active === 'MyOrders' && styles.paddingBottom
                ]}
                onPress={() => {
                  mutateAssignOrder({
                    variables: { id: order?._id }
                  })
                }}>
                <TextDefault bolder center textColor={colors.white}>
                  {loadingAssignOrder ? (
                    <Spinner size="small" color="transparent" />
                  ) : (
                    t('assignMe')
                  )}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Order
