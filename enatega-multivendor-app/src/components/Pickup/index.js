import React, { useContext, useState } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import DatePicker from '@react-native-community/datetimepicker'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../utils/scaling'
import { BorderlessButton } from 'react-native-gesture-handler'

function PickUp(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()
  const [showPicker, setShowPicker] = useState(false)
  const currentDate = props.minimumTime
  return (
    <View style={{ paddingTop: 50 }}>
      {props.isPickedUp ? (
        <Text style={styles().tabHeading}>Select Pickup date and time</Text>
      ) : (
        <Text style={styles().tabHeading}>Select Delivery date and time</Text>
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
          <Text style={{ fontSize: 20, fontWeight: '500' }}>PickUp</Text>
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
          <Text style={{ fontSize: 20, fontWeight: '500' }}>Delivery</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          paddingTop: 4
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
      {/* <TouchableOpacity
        style={[
          {
            margin: scale(20),
            backgroundColor: currentTheme.buttonBackground,
            alignItems: 'center',
            height: scale(35),
            justifyContent: 'center',
            borderRadius: scale(10)
          }
        ]}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>Apply</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default PickUp
