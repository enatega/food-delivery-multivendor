import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

// Checkout-only colour roles. The legacy theme has a few dark-mode values that
// read badly here (gray100 is black, gray200 stays light), so every checkout
// surface pulls its colours from these explicit light/dark roles instead.
const lightPalette = {
  canvas: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F4F5',
  track: '#E9EBEE',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#71717A',
  border: 'rgba(24, 24, 27, 0.08)',
  borderStrong: 'rgba(24, 24, 27, 0.16)',
  iconBackground: '#F4F4F5',
  switchOff: '#D4D4D8',
  disabledBackground: '#E4E4E7',
  disabledText: '#71717A',
  danger: '#DC2626',
  dangerSubtle: 'rgba(220, 38, 38, 0.08)',
  dangerBorder: 'rgba(220, 38, 38, 0.20)',
  success: '#15803D',
  warning: '#B45309',
  warningSubtle: '#FFF7ED',
  overlay: 'rgba(9, 9, 11, 0.48)',
  shadowOpacity: 0.06
}

const darkPalette = {
  canvas: '#000000',
  surface: '#141416',
  surfaceMuted: '#1F1F23',
  track: '#1C1C1F',
  textPrimary: '#FAFAFA',
  textSecondary: '#D4D4D8',
  textMuted: '#A1A1AA',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  iconBackground: '#232327',
  switchOff: '#3F3F46',
  disabledBackground: '#27272A',
  disabledText: '#71717A',
  danger: '#F87171',
  dangerSubtle: 'rgba(248, 113, 113, 0.12)',
  dangerBorder: 'rgba(248, 113, 113, 0.28)',
  success: '#4ADE80',
  warning: '#FBBF24',
  warningSubtle: 'rgba(251, 191, 36, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.72)',
  shadowOpacity: 0
}

const useCheckoutPalette = () => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const themeName = themeContext.ThemeValue
  const isDark = themeName === 'Dark'
  const isRTL = i18n.dir() === 'rtl'

  const palette = useMemo(() => {
    const legacy = theme[themeName] || {}
    const base = isDark ? darkPalette : lightPalette
    const brand = legacy.singleVendorBrand || '#90E36D'
    return {
      ...base,
      brand,
      onBrand: legacy.singleVendorOnBrand || '#10200A',
      brandText: legacy.singleVendorBrandForeground || (isDark ? '#B9F3A0' : '#397A20'),
      brandSubtle: isDark ? 'rgba(144, 227, 109, 0.12)' : '#F1FBEC',
      brandBorder: isDark ? 'rgba(144, 227, 109, 0.55)' : brand
    }
  }, [themeName, isDark])

  return { palette, isDark, isRTL }
}

export default useCheckoutPalette
