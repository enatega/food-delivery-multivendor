import { scale, verticalScale } from '../../utils/scaling'

export const spacing = Object.freeze({
  xxs: scale(2),
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  section: verticalScale(28)
})

export const radii = Object.freeze({
  none: 0,
  sm: scale(6),
  md: scale(10),
  tile: scale(12),
  lg: scale(14),
  xl: scale(18),
  round: scale(999)
})

export const sizes = Object.freeze({
  touchTarget: scale(44),
  headerContent: verticalScale(56),
  iconButton: scale(36),
  input: verticalScale(48),
  primaryButton: verticalScale(48),
  compactTile: scale(80)
})

export const typeScale = Object.freeze({
  display: { fontSize: scale(28), lineHeight: scale(34), fontWeight: '700' },
  title: { fontSize: scale(22), lineHeight: scale(28), fontWeight: '700' },
  heading: { fontSize: scale(18), lineHeight: scale(24), fontWeight: '700' },
  body: { fontSize: scale(14), lineHeight: scale(20), fontWeight: '400' },
  bodyStrong: { fontSize: scale(14), lineHeight: scale(20), fontWeight: '600' },
  caption: { fontSize: scale(12), lineHeight: scale(16), fontWeight: '400' }
})

const lightColors = Object.freeze({
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F7F7F8',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#71717A',
  textOnAccent: '#FFFFFF',
  textOnDanger: '#FFFFFF',
  borderSubtle: 'rgba(24, 24, 27, 0.10)',
  borderStandard: 'rgba(24, 24, 27, 0.18)',
  overlay: 'rgba(0, 0, 0, 0.46)',
  skeleton: '#E7E7EA',
  skeletonHighlight: '#F4F4F5',
  success: '#15803D',
  warning: '#B45309',
  danger: '#DC2626',
  info: '#0369A1'
})

const darkColors = Object.freeze({
  canvas: '#000000',
  surface: '#18181B',
  surfaceSubtle: '#202024',
  surfaceElevated: '#27272A',
  textPrimary: '#FAFAFA',
  textSecondary: '#D4D4D8',
  textMuted: '#A1A1AA',
  textOnAccent: '#FFFFFF',
  textOnDanger: '#2B0909',
  borderSubtle: 'rgba(161, 161, 170, 0.22)',
  borderStandard: 'rgba(161, 161, 170, 0.34)',
  overlay: 'rgba(0, 0, 0, 0.72)',
  skeleton: '#202024',
  skeletonHighlight: '#2B2B30',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#38BDF8'
})

export const resolveMultivendorTokens = (themeName, legacyTheme = {}) => {
  const isDark = themeName === 'Dark'
  const colors = isDark ? darkColors : lightColors

  return {
    isDark,
    colors: {
      ...colors,
      accent: legacyTheme.main || '#003B6F',
      accentForeground: isDark ? '#68BCE8' : '#003B6F',
      accentSubtle: isDark ? 'rgba(104, 188, 232, 0.18)' : 'rgba(0, 59, 111, 0.12)',
      focus: legacyTheme.main || '#003B6F'
    },
    spacing,
    radii,
    sizes,
    typeScale
  }
}
