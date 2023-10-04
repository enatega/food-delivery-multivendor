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
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { Entypo } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
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
      title: i18n.t('titlePayment'),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        marginLeft: 0
      },

      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          backImage={() => (
            <View style={styles().backButton}>
              <Entypo name="cross" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
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
      <View style={styles(currentTheme).mainContainer}>
        <View style={{ backgroundColor: currentTheme.themeBackground, borderRadius: 20 }}>
          {CASH.map((item, index) => (
            <TouchableOpacity
              style={[styles(currentTheme).radioGroup, styles(currentTheme).pT20]}
              key={index.toString()}
              onPress={() => {
                onSelectPayment(item)
              }}>
              <View style={styles(currentTheme).radioContainer}>
                <RadioButton
                  animation={'bounceIn'}
                  outerColor={currentTheme.darkBgFont}
                  innerColor={currentTheme.radioColor}
                  isSelected={paymentMethod.index === item.index}
                  onPress={() => {
                    onSelectPayment(item)
                  }}
                />
              </View>
              <View style={styles(currentTheme).paymentMethod}>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.fontSecondColor}
                  style={{ width: '60%' }}>
                  {item.label}
                </TextDefault>
                <View style={styles(currentTheme).iconContainer}>
                  {item.icon1 && (
                    <Image
                      resizeMode="cover"
                      style={[styles().iconStyle, { ...alignment.MRsmall }]}
                      source={item.icon1}
                    />
                  )}
                  <Image
                    resizeMode="cover"
                    style={styles().iconStyle}
                    source={item.icon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  )
}

export default Payment
