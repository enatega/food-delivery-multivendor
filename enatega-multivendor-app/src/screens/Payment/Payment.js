import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import styles from './styles'
import i18n from '../../../i18n'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import Analytics from '../../utils/analytics'
function Payment(props) {
  const { paymentMethod, coupon } = props.route.params
  const inset = useSafeAreaInsets()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const CASH = [
    {
      payment: 'STRIPE',
      label: i18n.t('creditCart'),
      index: 0,
      icon: require('../../assets/images/masterIcon.png'),
      icon1: require('../../assets/images/visaIcon.png')
    },
    {
      payment: 'PAYPAL',
      label: i18n.t('paypal'),
      index: 1,
      icon: require('../../assets/images/paypal.png')
    },
    {
      payment: 'COD',
      label: i18n.t('cod'),
      index: 2,
      icon: require('../../assets/images/cashIcon.png')
    }
  ]

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: i18n.t('titlePayment')
    })
  }, [props.navigation])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PAYMENT)
    }
    Track()
  }, [])
  function onSelectPayment(paymentMethod) {
    props.navigation.navigate('Cart', { coupon, paymentMethod })
  }
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        {CASH.map((item, index) => (
          <TouchableOpacity
            style={[styles().radioGroup, styles().pT20]}
            key={index.toString()}
            onPress={() => {
              onSelectPayment(item)
            }}>
            <View style={styles().radioContainer}>
              <RadioButton
                animation={'bounceIn'}
                outerColor={currentTheme.radioOuterColor}
                innerColor={currentTheme.radioColor}
                isSelected={paymentMethod.index === item.index}
                onPress={() => {
                  onSelectPayment(item)
                }}
              />
            </View>
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontMainColor}
              style={{ width: '60%' }}>
              {item.label}
            </TextDefault>
            <View style={styles().iconContainer}>
              {item.icon1 && (
                <Image
                  resizeMode="cover"
                  style={[styles().iconStyle, { ...alignment.MRxSmall }]}
                  source={item.icon1}
                />
              )}
              <Image
                resizeMode="cover"
                style={styles().iconStyle}
                source={item.icon}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Payment
