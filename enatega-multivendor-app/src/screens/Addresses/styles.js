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
      // backgroundColor: props !== null ? props.gray100 : 'transparent',
      width: '100%',
      // margin: scale(10),
      // padding: scale(5),
      // borderRadius: scale(10),
      // borderWidth: 1,
      borderBottomWidth: 2,
      borderBottomColor: props !== null ? props.gray200 : '#E5E7EB',
      // alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      // width: '55%',
      // justifyContent: 'center',
      // marginTop: -4,
      marginBottom: scale(5)
    },
    labelStyle: {
      // textAlignVertical: 'bottom',
      // fontSize: scale(14),
      // fontWeight: '700',
      // textAlign: 'left'
    },
    midContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    homeIcon: {
      color: props !== null ? props.darkBgFont : '#000',
      width: '15%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'red'
    },
    addressDetail: {
      // width: '80%',
      // alignSelf: 'flex-end',
      // fontSize: scale(4),
      // fontWeight: '300',
      // textAlign: 'justify',
      // paddingLeft: scale(45)
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: props !== null ? 'transparent' : 'transparent',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonsAddress: {
      // width: '35%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // paddingBottom: scale(3)
    },
    rowContainer: {
      // marginTop: scale(5),
      flexDirection: 'row',
      alignItems: 'center', // Adjust this as needed
      justifyContent: 'space-between',
      ...alignment.Psmall,
      // ...alignment.MxSmall,
      // backgroundColor: '#269fe6',
    },
    footer: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props.white : 'transparent'
    },
    // actionButton: {
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    //Modal
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      filter: 'blur(10)'
    },
    modalView: {
      width: '90%',
      alignItems: 'flex-start',
      gap: 24,
      margin: 20,
      backgroundColor: props !== null ? props.themeBackground : 'white',
      borderWidth: scale(1),
      borderColor: props !== null ? props.color10 : 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    btn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: scale(50),
      borderRadius: 40
    },
    btnCancel: {
      backgroundColor: props !== null ? props.white : 'white',
      borderWidth: 1,
      borderColor: props !== null ? props.black : 'black'
    },
    btnDelete: {
      backgroundColor: props !== null ? props.red600 : '#DC2626'
    },
    modalInput: {
      height: scale(40),
      borderWidth: 1,
      borderColor: props != null ? props.verticalLine : '#B8B8B8',
      padding: 5,
      borderRadius: 6,
      color: props !== null ? props.newFontcolor : '#f9f9f9'
    },
    modal: {
      backgroundColor: props != null ? props.themeBackground : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 16,
      paddingRight: 16
    },
  })
export default styles
