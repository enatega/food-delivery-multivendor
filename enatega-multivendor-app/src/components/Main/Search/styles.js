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
      color: props != null ? props.fontMainColor : 'black'
    },
    mainContainerHolder: {
      zIndex: 333,
      width: '100%',
      alignItems: 'center',     
      backgroundColor:newheaderColor,
      shadowColor: props != null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.1,
      shadowRadius: verticalScale(1),
      // ...alignment.MBmedium
    },
    mainContainer: {
      width: '90%',
      height: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(40),
      backgroundColor: props != null ? props.color1 : 'black',

      shadowColor: props != null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.2,
      shadowRadius: verticalScale(1),

    },
    subContainer: {
      width: '90%',
      height: '60%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    leftContainer: {
      flexDirection: 'row',
      width: '90%',
    },
    searchContainer: {
      width: '10%',
    },
    inputContainer: {
      width: '100%',
      justifyContent: 'center',
      ...alignment.MLxSmall,
      ...alignment.MRxSmall
    },
    filterContainer: {
      width: '10%',
      height: '90%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
