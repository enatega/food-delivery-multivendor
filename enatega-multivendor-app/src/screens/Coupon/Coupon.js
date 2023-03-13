import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { getCoupon } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import i18n from '../../../i18n'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './styles'
import analytics from '../../utils/analytics'
// Constants
const GET_COUPON = gql`
  ${getCoupon}
`

function SelectVoucher(props) {
  const { paymentMethod } = props.route.params
  const [voucherCode, voucherCodeSetter] = useState('')
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const [mutate] = useMutation(GET_COUPON, {
    onCompleted,
    onError
  })

  function onCompleted({ coupon }) {
    if (coupon) {
      if (coupon.enabled) {
        props.navigation.navigate('Cart', { paymentMethod, coupon })
        FlashMessage({
          message: i18n.t('coupanApply')
        })
      } else {
        FlashMessage({
          message: i18n.t('coupanFailed')
        })
      }
    }
  }
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_COUPON)
    }
    Track()
  }, [])
  // eslint-disable-next-line handle-callback-err
  function onError(error) {
    FlashMessage({
      message: i18n.t('invalidCoupan')
    })
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'My Vouchers'
    })
  }, [props.navigation])

  function onSelectCoupon(text) {
    mutate({ variables: { coupon: text } })
    // props.navigation.navigate('Cart', { CoupanObject: text })
  }

  const HeaderLine = props => {
    return (
      <View style={styles().headerlineContainer}>
        <View
          style={[styles(currentTheme).headerLine, { width: props.lineWidth }]}
        />
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={[
            alignment.PTsmall,
            alignment.PBsmall,
            { width: props.textWidth }
          ]}
          small
          bold
          center
          uppercase>
          {props.headerName}
        </TextDefault>
        <View
          style={[styles(currentTheme).headerLine, { width: props.lineWidth }]}
        />
      </View>
    )
  }
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <HeaderLine
          headerName="TYPe voucher code"
          textWidth="50%"
          lineWidth="25%"
        />
        <View style={styles().upperContainer}>
          <View style={{ width: '70%' }}>
            <TextField
              label="Enter your voucher code"
              labelFontSize={scale(12)}
              fontSize={scale(12)}
              labelHeight={10}
              maxLength={15}
              textColor={currentTheme.fontMainColor}
              baseColor={currentTheme.fontSecondColor}
              errorColor={currentTheme.textErrorColor}
              tintColor={currentTheme.iconColorPink}
              labelOffset={{ y1: -5 }}
              labelTextStyle={{ fontSize: scale(12), paddingTop: scale(1) }}
              onChangeText={text => {
                voucherCodeSetter(text)
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => onSelectCoupon(voucherCode)}
            style={styles(currentTheme).buttonContainer}>
            <TextDefault textColor={currentTheme.buttonText} H5 bold uppercase>
              {i18n.t('apply')}
            </TextDefault>
          </TouchableOpacity>
        </View>
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

export default SelectVoucher
