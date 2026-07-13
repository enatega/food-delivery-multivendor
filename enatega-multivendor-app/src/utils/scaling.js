import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const shortestSide = Math.min(width, height)
const longestSide = Math.max(width, height)
// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350
const guidelineBaseHeight = 680
const tabletBaseWidth = 768
const tabletBaseHeight = 1024

const isTablet = shortestSide >= 768
const isLargeTablet = isTablet && longestSide >= 1366

const softenTabletScale = factor => {
  const softness = isLargeTablet ? 0.5 : 0.65
  return 1 + (factor - 1) * softness
}

const scale = size => {
  if (!isTablet) return Math.round((width / guidelineBaseWidth) * size)

  const tabletFactor = shortestSide / tabletBaseWidth
  return Math.round(size * softenTabletScale(tabletFactor))
}

const verticalScale = size => {
  if (!isTablet) return Math.round((height / guidelineBaseHeight) * size)

  const tabletFactor = longestSide / tabletBaseHeight
  return Math.round(size * softenTabletScale(tabletFactor))
}

const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor)

export { scale, verticalScale, moderateScale }
