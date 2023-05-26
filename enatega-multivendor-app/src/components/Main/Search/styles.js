import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    bodyStyleOne: {
      fontFamily: fontStyles.MuseoSans500,
      fontSize: scale(14),
      color: props != null ? props.fontMainColor : 'black'
    },
    mainContainerHolder: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props != null ? props.headerMenuBackground : '#fafafa',
      shadowColor: props != null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.1,
      shadowRadius: verticalScale(1),
      ...alignment.MBmedium
    },
    mainContainer: {
      width: '90%',
      height: scale(60),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: props != null ? props.cartContainer : 'white',
      shadowColor: props != null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.2,
      shadowRadius: verticalScale(1),
      ...alignment.MTlarge,
      ...alignment.MBmedium
    },
    subContainer: {
      width: '90%',
      height: '80%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    leftContainer: {
      flexDirection: 'row',
      width: '90%'
    },
    searchContainer: {
      width: '10%',
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.MBxSmall
    },
    inputContainer: {
      width: '100%',
      justifyContent: 'center',
      ...alignment.MLxSmall,
      ...alignment.MRxSmall
    },
    filterContainer: {
      width: '10%',
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
