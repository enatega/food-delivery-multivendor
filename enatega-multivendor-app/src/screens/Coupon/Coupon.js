import React, { useEffect } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import BackArrowBlackBg from '../../assets/SVG/back-arrow-black-bg'
import CouponIcon from '../../assets/SVG/coupon-icon'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { fontStyles } from '../../utils/fontStyles'
import useCoupon from './useCoupon'
import styles from './styles'
import analytics from '../../utils/analytics'

const Coupon = ({ navigation, route }) => {
  const {
    theme,
    invalidCoupon,
    setInValidCoupon,
    couponCode,
    setCouponCode
  } = useCoupon()
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Apply a voucher',
      headerRight: null,
      headerLeft: () => (
        <TouchableOpacity
          style={[styles.header, { backgroundColor: theme.black }]}
          activeOpacity={0.7}
          onPress={navigation.goBack}>
          <BackArrowBlackBg />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: theme.black,
        fontSize: 25,
        fontFamily: fontStyles.MuseoSans700
      }
    })
  }, [])
  useEffect(async() => {
    await analytics.track(analytics.events.NAVIGATE_TO_COUPON)
  }, [])
  return (
    <View style={styles.container}>
      <View style={[styles.container, styles.imageContainer]}>
        <CouponIcon />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TextInput
          value={couponCode}
          onChangeText={text => {
            if (invalidCoupon) {
              setInValidCoupon(false)
            }
            setCouponCode(text)
          }}
          autoCapitalize="none"
          placeholder="voucher code"
          style={[
            styles.voucherInput,
            {
              backgroundColor: theme.white,
              shadowColor: invalidCoupon ? theme.errorInputBorder : theme.black
            }
          ]}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: theme.main }]}>
          <TextDefault bold H4>
            Apply
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Coupon
