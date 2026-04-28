import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, Image, FlatList } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import SearchFood from '../../assets/SVG/imageComponents/SearchFood'
import Spinner from '../../components/Spinner/Spinner'
import OrdersContext from '../../context/Orders'
import { useTranslation } from 'react-i18next'
import ConfigurationContext from '../../context/Configuration'
import StarIcon from '../../../src/assets/SVG/imageComponents/starIcon'
import { scale } from '../../utils/scaling'
import EmptyView from '../EmptyView/EmptyView'
import { ORDER_STATUS_ENUM } from '../../utils/enums'

function emptyViewPastOrders() {
  const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
  const orderStatusInactive = ['DELIVERED', 'COMPLETED']
  const { orders, loadingOrders, errorOrders } = useContext(OrdersContext)
  if (loadingOrders)
    return (
      <Spinner
        visible={loadingOrders}
        backColor='transparent'
        spinnerColor={currentTheme.main}
      />
    )
  if (errorOrders) return <TextError text={errorOrders.message} />
  else {
    const hasActiveOrders =
      orders.filter((o) => orderStatusActive.includes(o.orderStatus)).length > 0

    const hasPastOrders =
      orders.filter((o) => orderStatusInactive.includes(o.orderStatus)).length >
      0
    if (hasActiveOrders || hasPastOrders) return null
    return (
      <EmptyView
        title={'titleEmptyPastOrders'}
        description={'emptyPastOrdersDesc'}
        buttonText={'emptyPastOrdersBtn'}
        navigateTo='Discovery'
      />
    )
  }
}

const PastOrders = ({
  navigation,
  loading,
  error,
  pastOrders,
  onPressReview
}) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const configuration = useContext(ConfigurationContext)
  const { reFetchOrders, fetchMoreOrdersFunc, networkStatusOrders } =
    useContext(OrdersContext)
  const renderItem = ({ item }) => (
    <Item
      item={item}
      navigation={navigation}
      currentTheme={currentTheme}
      configuration={configuration}
      onPressReview={onPressReview}
    />
  )

  if (loading) {
    return <></>
  }
  if (error) return <TextError text={error.message} />

  return (
    <FlatList
      data={pastOrders}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={emptyViewPastOrders()}
      refreshing={networkStatusOrders === 4}
      onRefresh={() => networkStatusOrders === 7 && reFetchOrders()}
      onEndReached={fetchMoreOrdersFunc}
    />
  )
}

const formatDeliveredAt = (deliveredAt) => {
  // Check if deliveredAt is null, undefined, or empty
  if (!deliveredAt) {
    return 'N/A'
  }

  // Convert deliveredAt string to a Date object
  const deliveryDate = new Date(deliveredAt)

  // Check if the date is valid
  if (isNaN(deliveryDate.getTime())) {
    return 'N/A'
  }

  // Define months array for formatting
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  // Getting components of the date
  const day = deliveryDate.getDate()
  const month = months[deliveryDate.getMonth()]
  const hours = deliveryDate.getHours()
  const minutes = deliveryDate.getMinutes()

  // Padding single digits with 0
  const formattedDay = day < 10 ? '0' + day : day
  const formattedHours = hours < 10 ? '0' + hours : hours
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes

  // Formatting the date and time
  return `${formattedDay} ${month} ${formattedHours}:${formattedMinutes}`
}
const getItems = (items) => {
  return items
    .map(
      (item) =>
        `${item.quantity}x ${item.title}${
          item.variation.title ? `(${item.variation.title})` : ''
        }`
    )
    .join('\n')
}

const Item = ({
  item,
  navigation,
  currentTheme,
  configuration,
  onPressReview
}) => {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    {
      variables: { id: item._id },
      skip: item.orderStatus === ORDER_STATUS_ENUM.DELIVERED
    }
  )
  const { t } = useTranslation()

  return (
    <View style={{ ...alignment.MBsmall }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('OrderDetail', {
            _id: item._id,
            currencySymbol: configuration.currencySymbol,
            restaurant: item.restaurant,
            user: item.user
          })
        }
      >
        <View style={styles(currentTheme).subContainer}>
          {(item.orderStatus == 'CANCELLED' ||
            item.orderStatus === 'CANCELLEDBYREST') && (
            <View style={{ display: 'flex', paddingBottom: 10 }}>
              <View
                style={{
                  borderRadius: 14,
                  alignSelf: 'flex-end',
                  backgroundColor: currentTheme.statusBgColor,
                  color: 'black',
                  padding: 8
                }}
              >
                <TextDefault
                  textColor='black'
                  uppercase
                  bolder
                  numberOfLines={2}
                  style={[styles(currentTheme).restaurantName]}
                  isRTL
                >
                  {item.orderStatus}
                </TextDefault>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
            }}
          >
            <Image
              style={styles(currentTheme).restaurantImage}
              resizeMode='cover'
              source={{ uri: item?.restaurant?.image }}
            />
            <View style={styles(currentTheme).textContainer2}>
              <View
                style={{
                  flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
                }}
              >
                <View style={styles().subContainerLeft}>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    uppercase
                    bolder
                    numberOfLines={2}
                    style={styles(currentTheme).restaurantName}
                    isRTL
                  >
                    {item.restaurant.name}
                  </TextDefault>
                </View>
                <View style={styles(currentTheme).subContainerRight}>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    bolder
                    isRTL
                  >
                    {configuration.currencySymbol}
                    {parseFloat(item.orderAmount).toFixed(2)}
                  </TextDefault>
                </View>
              </View>
              <View style={{ marginTop: 'auto' }}>
                <TextDefault
                  numberOfLines={1}
                  style={{
                    ...alignment.MTxSmall
                    // width: '122%'
                  }}
                  textColor={currentTheme.secondaryText}
                  isRTL
                >
                  {(item.orderStatus === 'CANCELLED' || item.orderStatus === 'CANCELLEDBYREST') 
                    ? `${t('cancelledOn')} ${formatDeliveredAt(item.cancelledAt || item.completionTime)}`
                    : `${t('deliveredOn')} ${formatDeliveredAt(item.deliveredAt)}`
                  }
                </TextDefault>
                <TextDefault
                  numberOfLines={1}
                  style={{ ...alignment.MTxSmall }}
                  textColor={currentTheme.secondaryText}
                  isRTL
                >
                  {getItems(item.items)}
                </TextDefault>
              </View>
            </View>
          </View>
          <View style={styles().rateOrderContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).subContainerButton}
              onPress={() => navigation.navigate('Reorder', { item })}
            >
              <TextDefault textColor={currentTheme.black} H5 bolder B700 center>
                {' '}
                {t('reOrder')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          {!(
            item.orderStatus === 'CANCELLED' ||
            item.orderStatus === 'CANCELLEDBYREST'
          ) && (
            <View style={styles(currentTheme).starsContainer}>
              <View>
                <TextDefault
                  H5
                  bolder
                  textColor={currentTheme.newFontcolor}
                  isRTL
                >
                  {t('tapToRate')}
                </TextDefault>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <StarIcon
                    disabled={Boolean(item?.review)}
                    key={`star-icon-${index}`}
                    isFilled={index <= item?.review?.rating}
                    onPress={() => onPressReview(item, index)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default PastOrders
