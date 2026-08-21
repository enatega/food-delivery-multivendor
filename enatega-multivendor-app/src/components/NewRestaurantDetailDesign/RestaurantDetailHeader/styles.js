import { StyleSheet, Platform, StatusBar } from 'react-native'
import { scale } from '../../../utils/scaling'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#000000'
    },
    imageContainer: {
      width: '100%',
      position: 'relative',
      height: scale(210)
    },
    mainRestaurantImg: {
      height: '100%',
      width: '100%'
    },
    heroFallback: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#202024'
    },
    headerIconsContainer: {
      position: 'absolute',
      top: STATUSBAR_HEIGHT + scale(10),
      left: 0,
      right: 0,
      paddingHorizontal: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    },
    iconButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(999),
      backgroundColor: 'rgba(24, 24, 27, 0.82)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255, 255, 255, 0.16)'
    },
    deliveryDetailsOverlay: {
      position: 'absolute',
      bottom: scale(28),
      left: scale(12),
      right: scale(12),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      zIndex: 3
    },
    detailPill: {
      backgroundColor: 'rgba(24, 24, 27, 0.86)',
      borderRadius: scale(999),
      paddingVertical: scale(6),
      paddingHorizontal: scale(10),
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(4),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255, 255, 255, 0.14)'
    },
    detailLabel: {
      fontSize: scale(10),
      marginRight: scale(2),
      flexShrink: 1
    },
    detailValue: {
      fontWeight: 'bold'
    },
    contentContainer: {
      marginTop: -scale(16),
      marginHorizontal: scale(12),
      paddingHorizontal: scale(12),
      paddingTop: scale(12),
      paddingBottom: scale(12),
      gap: scale(8),
      borderRadius: scale(18),
      backgroundColor: props?.colors?.surface ?? props?.cardBackground ?? '#18181B',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    subContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    titleContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10),
      flex: 1
    },
    restaurantImg: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    cuisineContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: scale(22)
    },
    cuisineText: {
      flex: 1,
      ...props?.typeScale?.body
    },
    infoContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minHeight: scale(32)
    },
    ratingBox: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(8),
      flex: 1,
      minWidth: 0
    },
    reviewButton: {
      backgroundColor: props?.colors?.accentSubtle ?? props?.newButtonBackground ?? '#EEF5FA',
      borderRadius: scale(999),
      paddingVertical: scale(6),
      paddingHorizontal: scale(10),
      marginLeft: scale(8),
      flexShrink: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    timingContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%'
    },
    timingRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
      flex: 1,
      minWidth: 0
    },
    timingLabel: {
      flexShrink: 1
    },
    timingValue: {
      flexShrink: 1
    },
    statusButton: {
      backgroundColor: props?.colors?.accentSubtle ?? props?.newButtonBackground ?? '#EEF5FA',
      borderRadius: scale(999),
      paddingVertical: scale(6),
      paddingHorizontal: scale(10),
      marginLeft: scale(8),
      flexShrink: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    deliveryContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      gap: scale(8),
      marginTop: 0,
      paddingLeft: 0,
      minHeight: scale(24)
    },
    deliveryIconContainer: {
      width: scale(20),
      height: scale(20),
      alignItems: 'center',
      justifyContent: 'center'
    },
    deliveryText: {
      lineHeight: scale(18),
      paddingTop: 0,
      marginTop: 0,
      textAlignVertical: 'center',
      includeFontPadding: false
    },
    searchContainer: {
      paddingHorizontal: scale(15),
      marginTop: scale(10),
      marginBottom: scale(15)
    },
    searchBarContainer: {
      height: scale(45),
      backgroundColor: props?.searchBarColor,
      borderRadius: scale(25),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(15),
      borderWidth: 1,
      borderColor: props?.borderColor
    },
    searchIcon: {
      marginRight: scale(10),
      opacity: 0.5
    },
    searchText: {
      fontSize: scale(16),
      color: props?.fontSecondColor,
      flex: 1
    }
  })

export default styles
