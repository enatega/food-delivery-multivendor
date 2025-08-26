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
      backgroundColor: newheaderColor
    },
    mainContainer: {
      width: '90%',
      height: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(40),
      backgroundColor: props != null ? props?.color1 : 'black',

      shadowColor: props != null ? props?.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.2,
      shadowRadius: verticalScale(1)
    },
    subContainer: {
      width: '90%',
      height: '60%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row'
    },
    leftContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      width: '84%',
      gap: scale(8),
      overflow: 'hidden'
    },
    searchContainer: {
      width: '10%',
      alignSelf: 'center'
    },
    inputContainer: {
      justifyContent: 'center',
      ...alignment.MLxSmall,
      ...alignment.MRxSmall,
      width: '90%'
    },
    filterContainer: {
      width: '10%',
      height: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row'
      // borderColor: 'white',
      // borderWidth: 2
    }
  })
export default styles
