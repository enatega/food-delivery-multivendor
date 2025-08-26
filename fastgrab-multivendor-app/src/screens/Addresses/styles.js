import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
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
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      width: '90%',
      height: scale(55),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      ...alignment.PBmedium
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
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    width100: {
      width: '100%'
    },
    titleAddress: {
      marginBottom: scale(5)
    },
    midContainer: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    },
    homeIcon: {
      color: props !== null ? props.darkBgFont : '#000',
      width: '15%',
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    line: {
      height: 0.5,
      backgroundColor: props !== null ? props.borderBottomColor : '#f9f9f9',
    },
    buttonsAddress: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    rowContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.Psmall,
    }
  })
export default styles
