import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import DatePicker, {
  DateTimePickerAndroid
} from '@react-native-community/datetimepicker'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'
import TextDefault from '../Text/TextDefault/TextDefault'

function PickUp(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [isPickUp, setIsPickup] = useState(props?.isPickedUp)
  const [orderDate, setOrderDate] = useState(props?.orderDate)
  const minimumTime = useRef(moment().add('M', props?.minimumTime).toDate())
  const { t } = useTranslation()

  const onPressEdit = () => {
    DateTimePickerAndroid.open(datePickerProps)
  }
  const datePickerProps = {
    minimumDate: minimumTime.current,
    mode: 'time',
    display: 'default',
    value: new Date(orderDate),
    onChange: (event, date) => {
      const {
        type,
        nativeEvent: { timestamp, utcOffset }
      } = event
      console.log('onchange', type, timestamp, utcOffset, date)
      if (type === 'dismissed') setOrderDate(moment(timestamp).utcOffset(utcOffset, true))
    }
  }

  useEffect(() => {
    props?.setIsPickedUp(isPickUp)
  }, [isPickUp])
  useEffect(() => {
    console.log('useeffect', orderDate)
    props?.setOrderDate(orderDate)
  }, [orderDate])

  return (
    <View style={{ paddingTop: scale(30) }}>
      <View style={styles(currentTheme).tabContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsPickup(true)
          }}
          style={ isPickUp
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton}>
          <View style={isPickUp ? styles(currentTheme).tabSubHeadingActive : {}}>
            <TextDefault
              style={styles(currentTheme).tabSubHeading}
              textColor={isPickUp ? currentTheme.editProfileButton : ''}
              bolder
              H5
            >
              {t('pickUp')}
            </TextDefault>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPickup(false)
          }}
          style={
            !isPickUp
              ? styles(currentTheme).activeLabel
              : styles(currentTheme).labelButton
          }>
          <View
            style={!isPickUp ? styles(currentTheme).tabSubHeadingActive : {}}
          >
            <TextDefault
              style={styles(currentTheme).tabSubHeading}
              bolder
              H5
              textColor={!isPickUp ? currentTheme.editProfileButton : ''}
            >
              {t('delivery')}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          paddingTop: scale(4)
        }}
      >
        <TouchableOpacity
          disabled={Platform.OS === 'ios'}
          onPress={onPressEdit}
        >
          <Text
            style={
              Platform.OS === 'android'
                ? styles().androidDateFormat
                : styles().iosDateFormat
            }
          >
            {orderDate.format('MM-D-YYYY, h:mm a')}{' '}
            {Platform.OS === 'android' && (
              <FontAwesome
                name='edit'
                size={25}
                color={theme.Pink.iconColorPink}
              />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PickUp
