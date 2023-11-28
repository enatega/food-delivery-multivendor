import React, { useState } from 'react'
import { View, Pressable, TouchableOpacity } from 'react-native'
import { Spinner, TextDefault } from '..'
import styles from './styles'
import { colors, TIMES } from '../../utilities'
import { Overlay } from 'react-native-elements'
import { useAcceptOrder, usePrintOrder, useOrderRing } from '../../ui/hooks'
import {useTranslation} from 'react-i18next'

export default function OverlayComponent(props) {
  const {t} = useTranslation()
  const { visible, toggle, order, print, navigation } = props
  const [selectedTime, setSelectedTime] = useState(TIMES[0])
  const { acceptOrder, loading } = useAcceptOrder()
  const { muteRing } = useOrderRing()
  const { printOrder } = usePrintOrder()

  const btnPress = () => {
    if (print) {
      acceptOrder(order._id, selectedTime.toString())
      muteRing(order.orderId)
      printOrder(order._id)
    } else {
      acceptOrder(order._id, selectedTime.toString())
      muteRing(order.orderId)
    }
    toggle()
    loading ? <Spinner /> : navigation.goBack()
  }
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggle}
      overlayStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextDefault H1 bolder>
            {t('setTime')}
          </TextDefault>
          <TextDefault bold>{t('forPreparation')}</TextDefault>
        </View>
        <View style={styles.time}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
            {TIMES.map((time, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeBtn,
                  {
                    backgroundColor:
                      selectedTime === time ? 'black' : colors.white
                  }
                ]}>
                <TextDefault
                  small
                  style={{
                    color: selectedTime === time ? colors.darkgreen : 'black'
                  }}>
                  {time + t('mins')}
                </TextDefault>
              </Pressable>
            ))}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btn}
          onPress={btnPress}>
          <TextDefault bold style={{ color: colors.darkgreen }}>
            {t('setAndAccept')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </Overlay>
  )
}
