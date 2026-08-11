import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
const styles = (props = null) =>
  StyleSheet.create({
    screenBackground: {
      flex: 1,
      backgroundColor: props != null ? props?.themeBackground : '#FFF'
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props?.gray : '#B8B8B8'
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
    brandsPlaceHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: scale(3),
      paddingHorizontal: scale(20)
    },
    height80: {
      height: scale(80)
    },
    sectionSkeleton: {
      paddingTop: scale(18),
      paddingBottom: scale(12),
      backgroundColor: props?.colors?.canvas
    },
    sectionHeaderSkeleton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(12),
      marginBottom: scale(12)
    },
    restaurantRowSkeleton: {
      flexDirection: 'row',
      gap: scale(10),
      paddingLeft: scale(12),
      overflow: 'hidden'
    },
    restaurantCardSkeleton: {
      width: scale(276),
      borderRadius: scale(16),
      overflow: 'hidden',
      backgroundColor: props?.colors?.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle
    },
    cardCopySkeleton: {
      padding: scale(12),
      gap: scale(10)
    },
    cardTitleSkeleton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    metaSkeleton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: scale(4)
    },
    brandSectionSkeleton: {
      paddingVertical: scale(16),
      backgroundColor: props?.colors?.canvas
    },
    brandRowSkeleton: {
      flexDirection: 'row',
      gap: scale(12),
      paddingLeft: scale(12),
      overflow: 'hidden'
    },
    brandItemSkeleton: {
      width: scale(82),
      gap: scale(7)
    }
  })

export default styles
