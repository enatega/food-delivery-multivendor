import { useContext, useState } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const useCoupon = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [invalidCoupon, setInValidCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  return {
    theme: currentTheme,
    invalidCoupon,
    setInValidCoupon,
    couponCode,
    setCouponCode
  }
}

export default useCoupon
