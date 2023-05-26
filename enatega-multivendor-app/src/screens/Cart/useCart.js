import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import { useCallback, useContext, useRef, useState } from 'react'
import i18n from '../../../i18n'
import CashOnDeliveryCard from '../../assets/SVG/cash-on-delivery-card'
import MasterCard from '../../assets/SVG/master-card'
import PaypalCard from '../../assets/SVG/paypal-card'
import VisaCard from '../../assets/SVG/visa-card'
import { useConfigurationContext } from '../../context/Configuration'
import { LocationContext } from '../../context/Location'
import { useUserContext } from '../../context/User'
import { useRestaurant } from '../../ui/hooks'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import {
  PAYMENT_METHOD,
  PAYMENT_METHOD_KEY_STORAGE,
  SHIPPING_METHOD,
  VOUCHER_KEY_STORAGE
} from '../../utils/enums'
import { theme } from '../../utils/themeColors'

export default ({ navigation }) => {
  const shippingMethodModalRef = useRef()
  const addressModalRef = useRef()
  const onOpenShippingModal = useCallback(() => {
    shippingMethodModalRef.current.open()
  }, [])
  const onOpenAddressModal = useCallback(() => {
    addressModalRef.current.open()
  }, [])
  const onSelectPaymentMethod = useCallback(() => {
    navigation.navigate('PaymentMethod')
  }, [])
  const {
    profile,
    restaurant: cartRestaurant,
    cart,
    addQuantity,
    removeQuantity,
    deleteItem
  } = useUserContext()
  const {
    loading: loadingRestaurant,
    data: dataRestaurant,
    error: errorRestaurant
  } = useRestaurant(cartRestaurant)
  const configuration = useConfigurationContext()
  const [orderDate, setOrderDate] = useState(moment())
  const [tipAmount, setTipAmount] = useState(0)
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHOD.DELIVERY)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState()
  const [voucher, setVoucher] = useState(null)
  const { location, setLocation } = useContext(LocationContext)

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const onNavigateVoucher = () => {
    navigation.navigate('Coupon')
  }
  const onRemoveVoucher = () => {
    setVoucher(null)
    AsyncStorage.removeItem(PAYMENT_METHOD_KEY_STORAGE)
  }
  useFocusEffect(() => {
    ;(async() => {
      const method = await AsyncStorage.getItem(PAYMENT_METHOD_KEY_STORAGE)
      if (method) {
        let label = ''
        let icons = []

        switch (method) {
          case PAYMENT_METHOD.STRIPE:
            label = i18n.t('creditCart')
            icons = [VisaCard, MasterCard]
            break
          case PAYMENT_METHOD.PAYPAL:
            label = i18n.t('paypal')
            icons = [PaypalCard]
            break
          case PAYMENT_METHOD.COD:
            label = i18n.t('cod')
            icons = [CashOnDeliveryCard]
        }
        setSelectedPaymentMethod({
          label,
          icons
        })
      }
    })()
  })
  useFocusEffect(() => {
    ;(async() => {
      const voucher = await AsyncStorage.getItem(VOUCHER_KEY_STORAGE)
      if (voucher) {
        setVoucher(JSON.parse(voucher))
      }
    })()
  })
  return {
    location,
    setLocation,
    theme: currentTheme,
    orderDate,
    setOrderDate,
    cart,
    addQuantity,
    removeQuantity,
    deleteItem,
    loadingRestaurant,
    dataRestaurant: dataRestaurant,
    errorRestaurant,
    configuration,
    tipAmount,
    setTipAmount,
    profile,
    shippingMethod,
    setShippingMethod,
    shippingMethodModalRef,
    onOpenShippingModal,
    addressModalRef,
    onOpenAddressModal,
    onSelectPaymentMethod,
    selectedPaymentMethod,
    onNavigateVoucher,
    onRemoveVoucher,
    voucher
  }
}
