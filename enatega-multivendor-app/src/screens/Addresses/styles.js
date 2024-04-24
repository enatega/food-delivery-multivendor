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
      marginBottom: scale(65)
    },
    containerButton: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      width: '90%',
      height: scale(55),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    addButton: {
      backgroundColor: props !== null ? props.newheaderColor : 'transparent',
      width: '100%',
      height: scale(40),
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    containerSpace: {
      backgroundColor: props !== null ? props.gray100 : 'transparent',
      width: '92%',
      margin: scale(10),
      padding: scale(5),
      borderRadius: scale(10),
      borderWidth: 1,
      alignSelf: 'center',
      borderColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      width: '55%',
      justifyContent: 'center',
      marginTop: -4
    },
    labelStyle: {
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
      color: props !== null ? props.darkBgFont : '#000',
      width: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    addressDetail: {
      width: '80%',
      alignSelf: 'flex-end',
      fontSize: scale(4),
      fontWeight: '300',
      textAlign: 'justify',
      paddingLeft: scale(45)
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: props !== null ? 'transparent' : 'transparent',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonsAddress: {
      width: '35%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: scale(3)
    },
    rowContainer: {
      marginTop: scale(5),
      flexDirection: 'row',
      alignItems: 'center', // Adjust this as needed
      justifyContent: 'space-between'
    },
    footer: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props.white : 'transparent'
    }
  })
export default styles
