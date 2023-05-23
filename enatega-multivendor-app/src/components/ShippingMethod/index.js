import React, { useContext, useState } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import DatePicker from '@react-native-community/datetimepicker'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import TextDefault from '../Text/TextDefault/TextDefault'
import { SHIPPING_METHOD } from '../../utils/enums'

function ShippingMethod({
  shippingMethod,
  setShippingMethod,
  orderDate,
  setOrderDate,
  minimumTime
}) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [showPicker, setShowPicker] = useState(false)
  const currentDate = minimumTime
  const isPickUpOrder = shippingMethod === SHIPPING_METHOD.PICKUP
  return (
    <View style={{ paddingTop: 50 }}>
      <View style={styles().tabContainer}>
        <TouchableOpacity
          onPress={() => {
            setShippingMethod(SHIPPING_METHOD.PICKUP)
          }}
          style={
            isPickUpOrder
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton
          }>
          <TextDefault bold textColor={isPickUpOrder ? '#fff' : '#000'}>
            PickUp
          </TextDefault>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShippingMethod(SHIPPING_METHOD.DELIVERY)
          }}
          style={
            !isPickUpOrder
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton
          }>
          <TextDefault bold textColor={!isPickUpOrder ? '#fff' : '#000'}>
            Delivery
          </TextDefault>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          paddingTop: 5
        }}>
        <TouchableOpacity
          disabled={Platform.OS === 'ios'}
          onPress={() => {
            setShowPicker(true)
          }}>
          <Text
            style={
              Platform.OS === 'android'
                ? styles().androidDateFormat
                : styles().iosDateFormat
            }>
            {orderDate.format('MM-D-YYYY, h:mm a')}{' '}
            {Platform.OS === 'android' && (
              <FontAwesome
                name="edit"
                size={20}
                color={theme.Pink.iconColorPink}
              />
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {((Platform.OS === 'android' && showPicker) ||
          Platform.OS === 'ios') && (
          <DatePicker
            minimumDate={currentDate}
            mode={'time'}
            display={'spinner'}
            value={new Date(orderDate)}
            onChange={(event, date) => {
              if (
                date !== undefined &&
                currentDate.getTime() <= date.getTime()
              ) {
                setOrderDate(moment(date))
              }
              Platform.OS === 'android' && setShowPicker(false)
            }}
          />
        )}
      </View>
    </View>
  )
}

export default ShippingMethod
