import React, { useContext, useState } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import DatePicker from '@react-native-community/datetimepicker'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { scale } from '../../utils/scaling'
import {useTranslation} from 'react-i18next'

function PickUp(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [showPicker, setShowPicker] = useState(false)
  const currentDate = props.minimumTime
  const {t} = useTranslation()
  return (
    <View style={{ paddingTop: 30 }}>
      {props.isPickedUp ? (
        <Text style={styles().tabHeading}>{t('SelectPickupDT')}</Text>
      ) : (
          <Text style={styles().tabHeading} >{t('SelectDeliveryDT')}</Text>
      )}

      <View style={styles().tabContainer}>
        <TouchableOpacity
          onPress={() => {
            props.setIsPickedUp(true)
          }}
          style={
            props.isPickedUp
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton
          }>
          <Text style={styles().tabSubHeading}>{t('pickUp')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.setIsPickedUp(false)
          }}
          style={
            !props.isPickedUp
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton
          }>
          <Text style={styles().tabSubHeading}>{t('delivery')}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          paddingTop: scale(4)
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
            {props.orderDate.format('MM-D-YYYY, h:mm a')}{' '}
            {Platform.OS === 'android' && (
              <FontAwesome
                name="edit"
                size={25}
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
            value={new Date(props.orderDate)}
            onChange={(event, date) => {
              if (
                date !== undefined &&
                currentDate.getTime() <= date.getTime()
              ) {
                props.setOrderDate(moment(date))
              }
              Platform.OS === 'android' && setShowPicker(false)
            }}
          />
        )}
      </View>
    </View>
  )
}

export default PickUp
