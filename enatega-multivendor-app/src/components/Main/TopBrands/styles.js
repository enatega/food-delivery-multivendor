import { verticalScale, scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
import { subtleCardShadowSoft } from '../../../utils/cardShadows'
const { height } = Dimensions.get('window')

const buildStyles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      gap: 16
    },
    topbrandsSec: {
      gap: scale(8),
      marginHorizontal: scale(15),
      marginBottom: scale(25)
    },
    topbrandsHeading:{
      ...alignment.PRmedium

    },
    brandImg: {
      width: '100%',
      height: scale(70),
      objectFit: 'cover',
      borderRadius: 8,
    },
    topbrandsContainer: {
      width: scale(96),
      ...alignment.MRmedium
    },
    brandImgContainer: {
      backgroundColor: props != null ? props?.cardBackground : '#F3F4F6',
      borderRadius: 8,
      ...subtleCardShadowSoft
    },
    brandName: {
      marginTop: scale(6),
      marginBottom: scale(2),
      // Responsive but clamped so it's neither oversized nor overflowing.
      fontSize: Math.min(Math.max(scale(12), 11), 14),
      lineHeight: scale(16),
      // Reserve two lines so every card's delivery-time row aligns.
      minHeight: scale(32)
    },
    margin: {
      ...alignment.MLmedium,
      ...alignment.MBmedium
    },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      ...alignment.PBlarge
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props?.fontSecondColor : '#B8B8B8'
    },
    brandsPlaceHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: scale(3),
      paddingHorizontal: scale(20)
    },
    height80: {
      height: scale(80)
    },
    header: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // ...alignment.MRmedium,
      // marginHorizontal: scale(10),
    },
    seeAllBtn: {
      backgroundColor: props != null ? props?.newButtonBackground : '#F3FFEE',
      borderRadius: 4,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      
    }
  })

// Cache the built stylesheet per theme so it isn't rebuilt on every render.
const NULL_KEY = { __nullTheme: true }
const stylesCache = new WeakMap()

const styles = (props = null) => {
  const key = props ?? NULL_KEY
  const cached = stylesCache.get(key)
  if (cached) return cached
  const created = buildStyles(props)
  stylesCache.set(key, created)
  return created
}

export default styles
