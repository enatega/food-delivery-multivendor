import { verticalScale, scale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    containerInfo: {
      width: '100%',
      flex: 1,
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent',
      position: 'relative'
    },
    wrapper: {
      height: '100%',
      width: '100%',
      backgroundColor: 'red'
    },
    backgroundImage: {
      width: 180,
      height: 180,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headingTitle: {
      width: '50%'
    },
    headingLink: {
      width: '50%',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    containerHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props !== null ? props.tagColor : 'black',
      ...alignment.Plarge,
      borderRadius: 20
    },
    headingButton: {
      justifyContent: 'center',
      backgroundColor: props !== null ? props.secondaryBackground : 'black',
      alignItems: 'center',
      borderRadius: 5,
      ...alignment.PxSmall
    },
    lower: {
      backgroundColor: props !== null ? props.menuBar : 'transparent',
      alignSelf: 'center',
      width: '100%',
      borderRadius: 20,
      borderWidth:
        props !== null && props.themeBackground !== '#FAFAFA' ? 2 : 0,
      borderColor: props !== null ? props.shadowColor : 'transparent',
      ...alignment.MBlarge,
      ...alignment.Pmedium
    },
    upperContainer: {
      height: height * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent'
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
      backgroundColor: props !== null ? props.horizontalLine : 'transparent',
      width: scale(100),
      height: scale(30),
      borderRadius: 40,
      alignSelf: 'center',
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
      width: '10%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    homeIconImg: {
      width: scale(15),
      height: scale(15)
    },
    addressDetail: {
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
