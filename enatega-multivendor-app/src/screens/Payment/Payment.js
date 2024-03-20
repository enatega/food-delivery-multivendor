import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, Image, TouchableOpacity, StatusBar, Platform } from 'react-native'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'
import { textStyles } from '../../utils/textStyles'

function Payment(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const { paymentMethod, coupon } = props.route.params
  const inset = useSafeAreaInsets()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const iconArray = [
    {
      payment: 'STRIPE',
      label: t('creditCart'),
      index: 0,
      icon: 'credit-card',
      // icon1: require('../../assets/images/visaIcon.png')
    },
    {
      payment: 'PAYPAL',
      label: t('paypal'),
      index: 1,
      icon: 'paypal'
    },
    {
      payment: 'COD',
      label: t('cod'),
      index: 2,
      icon: 'dollar'
    }
  ]

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <TextDefault
            style={{
              color: currentTheme.btnText,
              ...textStyles.H4,
              ...textStyles.Bolder
            }}>
            Payment Methods
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.btnText,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        backgroundColor: currentTheme.transparent
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={{ ...alignment.PLxSmall }}>
              <AntDesign
                name="arrowleft"
                size={22}
                color={currentTheme.fontFourthColor}
              />
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
    props.navigation.navigate('Checkout', { coupon, paymentMethod })
  }
  return (
    <>
      <View style={[styles(currentTheme).mainContainer, styles().flex]}>
        <View>
          {iconArray.map((item, index) => (
            <View key={'iconArray-'+ index}>
              <TouchableOpacity
                style={styles(currentTheme).radioGroup}
                key={index.toString()}
                onPress={() => {
                  onSelectPayment(item)
                }}>
                <View style={styles(currentTheme).paymentMethod}>
                  <View style={styles(currentTheme).iconContainer}>
                    <FontAwesome style={styles().iconStyle} name={item.icon} size={18} />
                  </View>
                  <TextDefault
                    textColor={currentTheme.fontFourthColor}
                    medium
                    bolder>
                    {item.label}
                  </TextDefault>
                </View>
                <View style={styles(currentTheme).radioContainer}>
                  <RadioButton
                    outerColor={currentTheme.horizontalLine}
                    innerColor={currentTheme.main}
                    isSelected={paymentMethod.index === item.index}
                    size={12}
                    onPress={() => {
                      onSelectPayment(item)
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles(currentTheme).horizontalLine} />

            </View>
          ))}
        </View>
      </View>
    </>
  )
}

export default Payment
