import { scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')
const buildStyles = (props = null) =>
  StyleSheet.create({
    // ML20: {
    //   ...alignment.MLlarge
    // },
    offerScroll: {
      height: height * 0.37,
      width: '100%'
    },
    ItemTitle: {
      ...alignment.MRmedium
    },
    ItemDescription: {
      fontWeight: '400',
      marginTop: scale(5),
      marginBottom: scale(7),
      ...alignment.MRmedium
    },
    orderAgainSec: {
      marginBottom: scale(8)
    },
    topPicksSec: {
      ...alignment.MLmedium,
      marginBottom: scale(30)
    },
    margin: {
      ...alignment.MLmedium,
      ...alignment.MBmedium
    },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF'
    },
    placeHolderFadeColor: {
      backgroundColor: props?.colors?.skeletonHighlight ?? '#B8B8B8'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: scale(3),
      elevation: scale(3),
      marginBottom: scale(12),
      padding: scale(12)
    },
    height200: {
      height: scale(200)
    },
    header: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
      // ...alignment.MRmedium,
      // marginBottom: scale(8),
    },
    row: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 10
    },
    seeAllBtn: {
      minHeight: props?.sizes?.iconButton ?? 36,
      justifyContent: 'center',
      paddingHorizontal: props?.spacing?.xs ?? 4
    },
    sectionHeader: {
      marginBottom: 0
    },
    skeletonRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      gap: scale(10),
      paddingRight: scale(24)
    },
    popularSkeletonCard: {
      width: '47%',
      borderRadius: props?.radii?.lg ?? scale(14),
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F7F7F8',
      padding: scale(10)
    },
    popularSkeletonImage: {
      height: scale(165),
      borderRadius: scale(18),
      marginBottom: scale(10)
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
