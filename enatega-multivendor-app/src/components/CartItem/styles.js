import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(10),
      paddingVertical: scale(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props?.colors?.borderSubtle
    },
    itemDetails: {
      flex: 1,
      minWidth: 0,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10)
    },
    itemCopy: {
      flex: 1,
      minWidth: 0
    },
    suggestItemImg: {
      width: scale(60),
      height: scale(60)
    },
    suggestItemImgContainer: {
      width: scale(64),
      height: scale(64),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props?.colors?.surfaceSubtle || '#F3F4F6',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle || '#E5E7EB',
      borderRadius: scale(10),
      overflow: 'hidden'
    },
    priceRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      gap: scale(8),
      alignItems: 'center',
      marginTop: scale(5)
    },
    divider: {
      width: StyleSheet.hairlineWidth,
      height: scale(14),
      backgroundColor: props?.colors?.borderSubtle || '#D1D5DB'
    },
    actionContainer: {
      width: scale(108),
      height: scale(42),
      padding: scale(4),
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props?.colors?.surfaceSubtle || '#F3F4F6',
      borderRadius: scale(22),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle || '#E5E7EB',
      overflow: 'hidden'
    },
    actionContainerBtns: {
      width: scale(34),
      height: scale(34),
      borderRadius: scale(17),
      alignItems: 'center',
      justifyContent: 'center'
    },
    minusBtn: {
      backgroundColor: 'transparent'
    },
    plusBtn: {
      backgroundColor: props?.colors?.accent || '#111827'
    },
    actionContainerView: {
      minWidth: scale(24),
      justifyContent: 'center',
      alignItems: 'center'
    },
    additionalItem: {
      marginTop: scale(4),
      marginBottom: scale(2)
    },
    addonToggle: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    itemsDropdown: {
      borderLeftWidth: scale(2),
      borderColor: props?.colors?.borderSubtle || '#D1D5DB',
      paddingLeft: scale(8),
      marginVertical: scale(3)
    }
  })
export default styles
