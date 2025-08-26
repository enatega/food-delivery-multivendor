import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    containerInfo: {
      width: '100%',
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      marginTop: scale(20),
      paddingBottom: scale(20),
      borderRadius: scale(20)
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
    mainView: {
      paddingBottom: scale(100),
      marginBottom: scale(25)
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
      backgroundColor: props !== null ? props.radioOuterColor : 'transparent',
      margin: scale(10),
      padding: scale(5),
      borderRadius: scale(10),
      borderBottomWidth: 1,
      borderBottomColor: props !== null ? props.borderBottomColor : '#DAD6D6'
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    labelStyle: {
      width: '70%',
      textAlignVertical: 'bottom',
      fontSize: scale(14),
      fontWeight: '700',
      textAlign: 'left'
    },
    midContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    homeIcon: {
      width: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    addressDetail: {
      width: '65%',
      alignSelf: 'flex-end',
      fontSize: scale(4),
      fontWeight: '300',
      textAlign: 'justify'
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: props !== null ? 'transparent' : 'transparent',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonsAddress: {
      width: '20%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: scale(3)
    }
  })
export default styles
