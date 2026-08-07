import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      minHeight: scale(70),
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      paddingVertical: props?.spacing?.sm ?? scale(8),
      backgroundColor: props?.colors?.surface ?? props?.themeBackground ?? '#18181B',
      justifyContent: 'center',
      alignItems: 'center'
    },
    subContainer: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      gap: scale(12)
    },
    icon: {
      width: '8%',
      height: '55%',
      backgroundColor: props !== null ? props?.newFontcolor : '#fafafa',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(15)
    },
    quantity: {
      borderWidth: 1,
      paddingLeft: scale(18),
      paddingRight: scale(18),
      paddingTop: scale(10),
      paddingBottom: scale(10),
      borderRadius: scale(10),
      borderColor: props !== null ? props?.newFontcolor : '#fafafa'
    },
    btnContainer: {
      flex: 1,
      height: scale(48),
      backgroundColor: props?.colors?.accent ?? props?.main ?? '#90E36D',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: props?.radii?.md ?? scale(10)
    },
    btnContainerPending: {
      opacity: 0.72
    },
    // New styles for quantity
    actionContainer: {
      minWidth: scale(106),
      height: scale(44),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F3F4F6',
      borderRadius: props?.radii?.round ?? scale(999),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? '#E5E7EB'
    },
    actionContainerBtns: {
      width: scale(30),
      height: scale(30),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center'
    },
    minusBtn: {
      backgroundColor: 'transparent'
    },
    plusBtn: {
      backgroundColor: props?.colors?.accent ?? '#90E36D'
    },
    actionContainerView: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
