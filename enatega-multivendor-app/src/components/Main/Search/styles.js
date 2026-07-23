import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'

const styles = (props = null, newheaderColor = theme.headerMenuBackground) =>
  StyleSheet.create({
    bodyStyleOne: {
      fontFamily: fontStyles.MuseoSans500,
      fontSize: scale(14),
      color: props != null ? props?.fontMainColor : 'black',
      minHeight: verticalScale(40)
    },
    mainContainerHolder: {
      zIndex: 333,
      width: '100%',
      alignItems: 'center',
      backgroundColor: newheaderColor,
      paddingRight: scale(6)
    },
    mainContainer: {
      width: '100%',
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(40),
      backgroundColor: props != null ? props?.color1 : 'black',
      marginRight: scale(6),

      shadowColor: props != null ? props?.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.2,
      shadowRadius: verticalScale(1)
    },
    subContainer: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      paddingHorizontal: scale(12)
    },
    leftContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      flex: 1,
      gap: scale(8),
      overflow: 'hidden'
    },
    searchContainer: {
      width: scale(18),
      alignSelf: 'center'
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'center',
      ...alignment.MLxSmall,
      ...alignment.MRxSmall,
      width: 'auto'
    },
    filterContainer: {
      width: scale(20),
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row'
      // borderColor: 'white',
      // borderWidth: 2
    }
  })
export default styles
