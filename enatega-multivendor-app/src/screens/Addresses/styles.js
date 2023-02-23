import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    containerInfo: {
      width: '100%',
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      position: 'relative'
    },
    subContainerImage: {
      width: '100%',
      alignContent: 'center',
      justifyContent: 'center'
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    viewTitle: {
      ...alignment.Msmall
    },
    containerButton: {
      backgroundColor: props !== null ? props.iconColorPink : 'transparent',
      width: scale(40),
      height: scale(40),
      borderRadius: 50,
      position: 'absolute',
      right: scale(20),
      bottom: verticalScale(20),
      zIndex: 1,
      elevation: 7,
      shadowColor: props !== null ? props.shadowColor : 'transparent',
      shadowOffset: {
        width: scale(2),
        height: verticalScale(6)
      },
      shadowOpacity: 0.6,
      shadowRadius: verticalScale(5)
    },
    addButton: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    containerSpace: {
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      ...alignment.PBmedium,
      ...alignment.PTmedium
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    homeIcon: {
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    homeIconImg: {
      width: scale(15),
      height: scale(15)
    },
    addressDetail: {
      width: '80%',
      alignSelf: 'flex-end',
      ...alignment.PRsmall
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: props !== null ? props.horizontalLine : 'transparent',
      borderBottomWidth: StyleSheet.hairlineWidth
    }
  })
export default styles
