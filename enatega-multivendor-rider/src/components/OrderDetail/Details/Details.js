import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './style'
import TextDefault from '../../Text/TextDefault/TextDefault'
import colors from '../../../utilities/colors'
import Spinner from '../../Spinner/Spinner'
import TextError from '../../Text/TextError/TextError'
import CountDown from 'react-native-countdown-component'
import useDetails from './useDetails'

const Details = ({ orderData, navigation, itemId, distance, duration }) => {
  const {
    active,
    order,
    dataConfig,
    loadingConfig,
    errorConfig,
    preparationSeconds,
    currentSeconds,
    mutateAssignOrder,
    mutateOrderStatus,
    loadingAssignOrder,
    loadingOrderStatus
  } = useDetails(orderData)

  if (!order) return null

  return (
    <View style={styles.container}>
      {order.orderStatus !== 'DELIVERED' ? (
        <>
          <View>
            <TextDefault H3 bolder center textColor={colors.black}>
              Preparing
            </TextDefault>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.timeContainer}>
            <TextDefault center bold H5 textColor={colors.fontSecondColor}>
              Time Left To Prepare Meal
            </TextDefault>
            <CountDown
              until={preparationSeconds - currentSeconds}
              size={20}
              timeToShow={['H', 'M', 'S']}
              timeLabels={{ h: null, m: null, s: null }}
              digitStyle={{ backgroundColor: colors.white, width: 50 }}
              digitTxtStyle={{ color: colors.black, fontSize: 30 }}
              showSeparator={true}
            />
          </View>
          {distance !== null ? (
            <View style={styles.timeContainer}>
              <TextDefault center bold H5 textColor={colors.fontSecondColor}>
                Distance to destination
              </TextDefault>
              <TextDefault center bolder H2>
                {`${distance.toFixed(2)} km`}
              </TextDefault>
            </View>
          ) : null}
          {duration !== null ? (
            <View style={styles.timeContainer}>
              <TextDefault center bold H5 textColor={colors.fontSecondColor}>
                Duration to reach destination
              </TextDefault>
              <TextDefault center bolder H2>
                {`${duration.toFixed(0)} mins`}
              </TextDefault>
            </View>
          ) : null}
          {active === 'NewOrders' ? (
            <View style={styles.btnContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  mutateAssignOrder({ variables: { id: itemId } })
                }}
                style={[styles.btn, { backgroundColor: colors.black }]}>
                <TextDefault center H5 bold textColor={colors.white}>
                  {loadingAssignOrder ? <Spinner size="small" /> : 'Assign me'}
                </TextDefault>
              </TouchableOpacity>
            </View>
          ) : order.orderStatus === 'ASSIGNED' ? (
            <View style={styles.btnContainer}>
              <ChatWithCustomerButton navigation={navigation} order={order} />
              <TouchableOpacity
                onPress={() => {
                  mutateOrderStatus({
                    variables: { id: itemId, status: 'PICKED' }
                  })
                }}
                activeOpacity={0.8}
                style={[styles.btn, { backgroundColor: colors.black }]}>
                <TextDefault center bold H5 textColor={colors.white}>
                  {loadingOrderStatus ? <Spinner size="small" /> : 'Pick'}
                </TextDefault>
              </TouchableOpacity>
            </View>
          ) : order.orderStatus === 'PICKED' ? (
            <View style={styles.btnContainer}>
              <ChatWithCustomerButton navigation={navigation} order={order} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  mutateOrderStatus({
                    variables: { id: itemId, status: 'DELIVERED' }
                  })
                }}
                style={[
                  styles.btn,
                  { backgroundColor: colors.primary },
                  loadingOrderStatus ? styles.pt5 : styles.pt15
                ]}>
                <TextDefault center H5 bold textColor={colors.black}>
                  {loadingOrderStatus ? (
                    <Spinner size="small" color="transparent" />
                  ) : (
                    'Mark as Delivered'
                  )}
                </TextDefault>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      ) : null}

      <View style={styles.heading}>
        <TextDefault bolder H1 center textColor={colors.primary}>
          Order Details
        </TextDefault>
      </View>
      <OrderDetails order={order} />
      <ItemDetails
        order={order}
        dataConfig={dataConfig}
        loading={loadingConfig}
        error={errorConfig}
      />
    </View>
  )
}

const OrderDetails = ({ order }) => {
  return (
    <View style={styles.orderDetails}>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={styles.col1}>
          Your Order From
        </TextDefault>
        <TextDefault bolder H5 textColor={colors.black} style={styles.col2}>
          {order.restaurant.name}
        </TextDefault>
      </View>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={styles.col1}>
          Order No.
        </TextDefault>
        <TextDefault bolder H5 textColor={colors.black} style={styles.col2}>
          {order.orderId}
        </TextDefault>
      </View>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={styles.col1}>
          Delivery Address
        </TextDefault>
        <TextDefault bolder H5 textColor={colors.black} style={styles.col2}>
          {order.deliveryAddress.deliveryAddress}
        </TextDefault>
      </View>
    </View>
  )
}

const ItemDetails = ({ order, dataConfig, loading, error }) => {
  let subTotal = 0
  if (loading) return <Spinner />
  if (error) return <TextError text="Something went wrong. Try again later!" />
  return (
    <View style={styles.orderDetails}>
      {order.items.map(item => {
        subTotal = subTotal + item.variation.price
        return (
          <View key={item._id} style={styles.rowDisplay}>
            <TextDefault bolder H4 style={styles.coll1}>
              {item.quantity}X
            </TextDefault>
            <View style={styles.coll2}>
              <TextDefault textColor={colors.fontSecondColor} bold H5>
                {item.title}
              </TextDefault>
              {item.addons
                ? item.addons.map(addon => (
                  <TextDefault
                    key={addon._id}
                    textColor={colors.fontSecondColor}
                    bold>
                    {addon.title}
                  </TextDefault>
                ))
                : null}
            </View>
            <TextDefault
              bolder
              H5
              textColor={colors.black}
              style={styles.coll3}>
              {dataConfig.configuration.currencySymbol}
              {item.variation.price}
            </TextDefault>
          </View>
        )
      })}
      <View style={styles.horizontalLine2} />
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={[styles.coll2, { flex: 9 }]}>
          Sub Total
        </TextDefault>
        <TextDefault
          bolder
          H5
          textColor={colors.black}
          style={[styles.coll3, { flex: 3 }]}>
          {dataConfig.configuration.currencySymbol}
          {subTotal}
        </TextDefault>
      </View>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={[styles.coll2, { flex: 9 }]}>
          Tip
        </TextDefault>
        <TextDefault
          bolder
          H5
          textColor={colors.black}
          style={[styles.coll3, { flex: 3 }]}>
          {dataConfig.configuration.currencySymbol}
          {order.tipping}
        </TextDefault>
      </View>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={[styles.coll2, { flex: 9 }]}>
          Tax Charges
        </TextDefault>
        <TextDefault
          bolder
          H5
          textColor={colors.black}
          style={[styles.coll3, { flex: 3 }]}>
          {dataConfig.configuration.currencySymbol}
          {order.taxationAmount}
        </TextDefault>
      </View>
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={[styles.coll2, { flex: 9 }]}>
          Delivery Charges
        </TextDefault>
        <TextDefault
          bolder
          H5
          textColor={colors.black}
          style={[styles.coll3, { flex: 3 }]}>
          {dataConfig.configuration.currencySymbol}
          {order.deliveryCharges}
        </TextDefault>
      </View>
      <View style={styles.horizontalLine2} />
      <View style={styles.rowDisplay}>
        <TextDefault
          textColor={colors.fontSecondColor}
          bold
          H5
          style={[styles.coll2, { flex: 9 }]}>
          TOTAL
        </TextDefault>
        <TextDefault
          bolder
          H5
          textColor={colors.black}
          style={[styles.coll3, { flex: 3 }]}>
          {dataConfig.configuration.currencySymbol}
          {order.orderAmount}
        </TextDefault>
      </View>
    </View>
  )
}

const ChatWithCustomerButton = ({ navigation, order }) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('ChatWithCustomer', {
        phoneNumber: order?.user.phone,
        id: order?._id
      })
    }
    activeOpacity={0.8}
    style={[styles.btn, { backgroundColor: colors.black }]}>
    <TextDefault center H5 bold textColor={colors.white}>
      Chat with Customer
    </TextDefault>
  </TouchableOpacity>
)
export default Details
