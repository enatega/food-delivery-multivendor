import {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react'
import i18n from '../../../i18n'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import CashOnDeliveryCard from '../../assets/SVG/cash-on-delivery-card'
import PaypalCard from '../../assets/SVG/paypal-card'
import VisaCard from '../../assets/SVG/visa-card'
import MasterCard from '../../assets/SVG/master-card'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PAYMENT_METHOD, PAYMENT_METHOD_KEY_STORAGE } from '../../utils/enums'

const usePaymentMethod = ({ navigation }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const paymentMethods = useMemo(
    () => [
      {
        id: '0x00000001',
        method: PAYMENT_METHOD.STRIPE,
        label: i18n.t('creditCart'),
        icons: [VisaCard, MasterCard]
      },
      {
        id: '0x00000002',
        method: PAYMENT_METHOD.PAYPAL,
        label: i18n.t('paypal'),
        icons: [PaypalCard]
      },
      {
        id: '0x00000003',
        method: PAYMENT_METHOD.COD,
        label: i18n.t('cod'),
        icons: [CashOnDeliveryCard]
      }
    ],
    []
  )
  const [selectedMethod, setSelectedMethod] = useState()
  const isMount = useRef(false)
  const onSelectPaymentMethod = useCallback(async paymentMethod => {
    await AsyncStorage.setItem(PAYMENT_METHOD_KEY_STORAGE, paymentMethod.method)
    setSelectedMethod(paymentMethod.method)
  }, [])
  useEffect(() => {
    ;(async() => {
      const method = await AsyncStorage.getItem(PAYMENT_METHOD_KEY_STORAGE)
      setSelectedMethod(
        method
          ? paymentMethods.find(pm => pm.method === method)
          : paymentMethods[0]
      )
      isMount.current = false
    })()
  }, [])
  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true
    } else {
      navigation.goBack()
    }
  }, [selectedMethod])
  return {
    theme: currentTheme,
    paymentMethods,
    selectedMethod,
    onSelectPaymentMethod
  }
}
export default usePaymentMethod
