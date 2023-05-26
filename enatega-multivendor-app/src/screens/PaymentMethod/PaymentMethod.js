import React, { useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import BackArrowBlackBg from '../../assets/SVG/back-arrow-black-bg'
import PaymentMethodSVG from '../../assets/SVG/payment-method'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { fontStyles } from '../../utils/fontStyles'
import { MethodRow } from './PaymentMethod.components'
import styles from './styles'
import usePaymentMethod from './usePaymentMethod'
const PaymentMethod = ({ navigation }) => {
  const {
    theme,
    paymentMethods,
    selectedMethod,
    onSelectPaymentMethod
  } = usePaymentMethod({ navigation })
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Payment',
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

  return (
    <View style={styles.container}>
      <View style={[styles.container, styles.imageContainer]}>
        <PaymentMethodSVG />
      </View>
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { backgroundColor: theme.white }
        ]}>
        <TextDefault style={{ ...alignment.MBlarge }} bolder H4>
          Select a payment method
        </TextDefault>
        {paymentMethods.map(method => (
          <MethodRow
            key={method.id}
            theme={theme}
            selected={method.id === selectedMethod?.id}
            label={method.label}
            icons={method.icons}
            onPress={() => onSelectPaymentMethod(method)}
          />
        ))}
      </View>
    </View>
  )
}
export default PaymentMethod
