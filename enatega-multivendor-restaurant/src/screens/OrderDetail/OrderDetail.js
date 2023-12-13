import React, { useState } from 'react'
import { View, ActivityIndicator, ImageBackground } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Spinner, TextDefault } from '../../components'
import { colors, MAX_TIME } from '../../utilities'
import styles from './styles'
import { Image, Button } from 'react-native-elements'
import OrderDetails from '../../components/OrderDetails/OrderDetails'
import { OverlayComponent } from '../../components/Overlay'
import BackButton from '../../components/BackButton/BackButton'
import moment from 'moment'
import { useCancelOrder, useOrderPickedUp, useOrderRing } from '../../ui/hooks'
import CountDown from 'react-native-countdown-component'
import { useRestaurantContext } from '../../ui/context/restaurant'
import { useTranslation } from 'react-i18next'

export default function OrderDetail({ navigation, route }) {
  const { t } = useTranslation()
  const { activeBar, orderData, preparationTime, createdAt } = route.params
  const { _id, orderDate } = orderData
  const { cancelOrder, loading: cancelLoading } = useCancelOrder()
  const { pickedUp, loading: loadingPicked } = useOrderPickedUp()
  const { muteRing } = useOrderRing()
  const [overlayVisible, setOverlayVisible] = useState(false)
  const isAcceptButtonVisible = !moment().isBefore(orderDate)
  const [print, setPrint] = useState(false)

  const { data } = useRestaurantContext()
  // current
  const timeNow = new Date()

  // create Time and Difference of 2 min calcualtion
  const createdTime = new Date(createdAt)
  const remainingTime = moment(createdTime)
    .add(MAX_TIME, 'seconds')
    .diff(timeNow, 'seconds')

  // accept time for late time deliveries
  const date = new Date(orderDate)
  const acceptTime = moment(date).diff(timeNow, 'seconds')

  // preparation time based on selection
  const prep = new Date(preparationTime)
  const diffTime = prep - timeNow
  const totalPrep = diffTime > 0 ? diffTime / 1000 : 0

  // checking whether to give 2 min time or accept time
  const decision = !isAcceptButtonVisible
    ? acceptTime
    : remainingTime > 0
    ? remainingTime
    : 0

  // image path
  const order = data.restaurantOrders.find(o => o._id === _id)
  const imagePath =
    activeBar === 2
      ? require('../../assets/shop.png')
      : require('../../assets/bowl.png')

  const toggleOverlay = () => {
    setPrint(false)
    setOverlayVisible(!overlayVisible)
  }
  const togglePrintOverlay = () => {
    setPrint(true)
    setOverlayVisible(!overlayVisible)
  }
  const cancelOrderFunc = () => {
    cancelOrder(order._id, 'not available')
    muteRing(order.orderId)
    if (cancelLoading) {
      return <Spinner />
    } else {
      navigation.goBack()
    }
  }
  const pickUpOrderFunc = () => {
    pickedUp(order._id)
    if (loadingPicked) {
      return <Spinner />
    } else {
      navigation.goBack()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <BackButton navigation={navigation} />
      <ImageBackground
        source={require('../../assets/bg.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/HeaderLight.png')}
            PlaceholderContent={<ActivityIndicator />}
            style={{ width: 150, height: 140 }}
          />
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.barContainer}>
            <View style={styles.roundedBar}>
              <View style={styles.iconContainer}>
                <Image
                  source={imagePath}
                  PlaceholderContent={<ActivityIndicator />}
                  style={{ width: 25, height: 25 }}
                />
              </View>
              <View style={styles.textContainer}>
                <TextDefault bolder H4>
                  {activeBar === 2 ? t('prepared') : t('preparing')}
                </TextDefault>
                <TextDefault>
                  {activeBar === 2 ? t('delivered') : t('accepted')}
                </TextDefault>
              </View>
            </View>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <View style={{ marginBottom: 20 }}>
                {!isAcceptButtonVisible && (
                  <TextDefault>{t('acceptOrderText')} </TextDefault>
                )}
                {activeBar === 0 && (
                  <CountDown
                    until={decision}
                    size={20}
                    timeToShow={['H', 'M', 'S']}
                    digitStyle={{ backgroundColor: colors.white }}
                    digitTxtStyle={{
                      color: 'black',
                      fontSize: 35
                    }}
                    timeLabels={{ h: null, m: null, s: null }}
                    showSeparator
                    separatorStyle={{
                      color: 'black'
                    }}
                  />
                )}
                {activeBar === 1 && (
                  <>
                    <TextDefault textColor="gray" bolder center>
                      {t('timeLeft')}
                    </TextDefault>
                    <CountDown
                      until={totalPrep}
                      size={20}
                      timeToShow={['H', 'M', 'S']}
                      digitStyle={{ backgroundColor: colors.white }}
                      digitTxtStyle={{
                        color: 'black',
                        fontSize: 35
                      }}
                      timeLabels={{ h: null, m: null, s: null }}
                      showSeparator
                      separatorStyle={{
                        color: 'black'
                      }}
                    />
                  </>
                )}
              </View>
              {activeBar === 0 && isAcceptButtonVisible && (
                <>
                  <Button
                    title={t('acceptAndPrint')}
                    buttonStyle={{
                      backgroundColor: colors.green,
                      borderRadius: 10,
                      padding: 15
                    }}
                    titleStyle={{ color: 'black', fontWeight: '500' }}
                    containerStyle={{
                      width: 250
                    }}
                    onPress={togglePrintOverlay}
                  />

                  <Button
                    title={t('accept')}
                    buttonStyle={{
                      backgroundColor: 'black',
                      borderRadius: 10,
                      padding: 15
                    }}
                    titleStyle={{ color: colors.white, fontWeight: '500' }}
                    containerStyle={{
                      width: 250,
                      marginVertical: 10
                    }}
                    onPress={toggleOverlay}
                  />
                  <OverlayComponent
                    visible={overlayVisible}
                    toggle={toggleOverlay}
                    order={order}
                    print={print}
                    navigation={navigation}
                  />
                </>
              )}
              {activeBar === 1 && (
                <>
                  <Button
                    title={t('delivered')}
                    buttonStyle={{
                      backgroundColor: colors.green,
                      borderColor: colors.darkgreen,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      padding: 15
                    }}
                    titleStyle={{
                      color: 'black',
                      fontWeight: '500'
                    }}
                    containerStyle={{
                      width: 250,
                      marginVertical: 10
                    }}
                    onPress={pickUpOrderFunc}
                  />
                </>
              )}
              {activeBar !== 2 && (
                <>
                  <Button
                    title={t('reject')}
                    buttonStyle={{
                      borderColor: colors.orderUncomplete,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      padding: 15
                    }}
                    type="outline"
                    titleStyle={{
                      color: colors.orderUncomplete,
                      fontWeight: '500'
                    }}
                    containerStyle={{
                      width: 250
                    }}
                    onPress={cancelOrderFunc}
                  />
                </>
              )}
              {activeBar === 2 && (
                <>
                  <TextDefault H3 textColor={colors.darkgreen} bold>
                    {t('delivered')}
                  </TextDefault>
                </>
              )}
            </View>
            <View style={styles.borderContainer}>
              <TextDefault bold H2 center>
                {t('orderDetail')}
              </TextDefault>
            </View>

            <OrderDetails orderData={orderData} />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  )
}
