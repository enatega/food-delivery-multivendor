import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: '#FAFAFA'
    },
    subContainer: {
      flexGrow: 1,
      alignItems: 'center',
      borderWidth: scale(0.3),
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderColor: 'grey',
      justifyContent: 'space-between',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PTlarge
    },
    upperContainer: {
      width: '90%',
      alignItems: 'center'
    },
    horizontalLine: {
      borderBottomColor: theme.Pink.tagColor,
      borderBottomWidth: 1,
      marginVertical: 10, // Adjust this value to control the spacing above and below the line
      width: '90%',
      alignSelf: 'center',
      marginBottom: 30
    },
    addressContainer: {
      paddingTop: 0,
      width: '100%',
      ...alignment.Psmall
    },
    labelButtonContainer: {
      ...alignment.PxSmall,
      width: '100%'
    },
    labelTitleContainer: {
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    buttonInline: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    labelButton: {
      width: '30%',
      borderWidth: 1,
      borderColor: props !== null ? props.shadowColor : 'transparent',
      borderRadius: 30,
      justifyContent: 'center',
      ...alignment.PxSmall
    },
    activeLabel: {
      width: '30%',
      borderWidth: 1,
      borderRadius: 30,
      justifyContent: 'center',
      color: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.tagColor : 'transparent',
      backgroundColor: theme.Pink.tagColor,
      ...alignment.PxSmall
    },
    saveBtnContainer: {
      width: '80%',
      height: verticalScale(40),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      alignSelf: 'center'
    },
    fakeMarkerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      marginLeft: -24,
      marginTop: -58,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    marker: {
      height: 48,
      width: 48
    },
    mapContainer: {
      height: '40%',
      backgroundColor: 'transparent'
    },
    geoLocation: {
      flexDirection: 'row'
    }
  })
export default styles
