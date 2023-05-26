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
    mainContainer: {
      height: scale(50),
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
      borderRadius: 20,
      ...alignment.PLsmall,
      ...alignment.PRsmall
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
    cancelContainer: {
      width: '10%',
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    filterContainer: {}
  })
export default styles
