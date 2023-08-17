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
      ...alignment.PTmedium,
      // ...alignment.MBsmall,
      // borderRadius: scale(16),
      // minHeight: 140,
      borderBottomWidth: 1,
      borderBottomColor: '#DAD6D6'
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
      fontWeight: '400'
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
    // homeIconImg: {
    //   width: scale(15),
    //   height: scale(15)
    // },
    addressDetail: {
      width: '65%',
      alignSelf: 'flex-end',
      // ...alignment.PRsmall,
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
      // marginRight: 20,
      // padding: scale(10)
    }
    // editButton: {
    //   backgroundColor: '#90EA93',
    //   display: 'flex',
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderRadius: scale(6),
    //   padding: 5,
    //   paddingLeft: 8,
    //   paddingRight: 8,
    //   marginHorizontal: 4,
    //   fontSize: scale(8),
    //   fontWeight: '300'
    // },
    // deleteButton: {
    //   backgroundColor: '#fe0000',
    //   display: 'flex',
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderRadius: scale(6),
    //   padding: 5,
    //   paddingLeft: 8,
    //   paddingRight: 8,
    //   marginHorizontal: 4,
    //   fontSize: scale(8),
    //   fontWeight: '300'
    // },
    // editIcon: {
    //   paddingRight: 4
    // },
    // btnTextWhite: {
    //   color: 'white'
    // }
  })
export default styles
