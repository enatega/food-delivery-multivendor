
import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View, Platform } from 'react-native'
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
  const currentDate = new Date().getTime() + (props?.minimumTime * 60000 || 0)
  const { t } = useTranslation()

  const datePickerOptions = {
    // Note that on Android, minimumDate only works for date mode because TimePicker does not support this.
    minimumDate: new Date(currentDate),
    mode: 'time',
    display: 'spinner',
    value: props?.orderDate,
    onChange: (event, date) => {
      if (date && new Date(date) >= new Date(currentDate)) {
        props?.setOrderDate(date)
      }
    },
    textColor: props?.pickupTextColor || currentTheme.newFontcolor,
  }

  useEffect(() => {
    props?.setIsPickedUp(isPickUp)
  }, [isPickUp])


  const onEditPress = () => {
    if (Platform.OS === 'android') DateTimePickerAndroid.open(datePickerOptions)
  }

  return (
    <View style={{ paddingTop: 30 }}>
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
          onPress={onEditPress}
        >
          <TextDefault
            textColor={props?.pickupTextColor}
            style={
              Platform.OS === 'android'
                ? styles().androidDateFormat
                : styles().iosDateFormat
            }
          >
            {moment(props?.orderDate).format('MM-D-YYYY, h:mm a')}{' '}
            {Platform.OS === 'android' && (
              <FontAwesome
                name='edit'
                size={25}
                color={props?.pickupTextColor}
              />
            )}
          </TextDefault>
        </TouchableOpacity>
      </View>
      <View>
        {Platform.OS === 'ios' && <DatePicker {...datePickerOptions} />}
      </View>
    </View>
  )
}

export default PickUp
