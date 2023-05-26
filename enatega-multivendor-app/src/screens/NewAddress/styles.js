import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: '#FAFAFA'
    },
    subContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      ...alignment.PTlarge
    },
    upperContainer: {
      width: '100%',
      alignItems: 'center'
    },
    addressContainer: {
      paddingTop: 0,
      width: '100%',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    labelButtonContainer: {
      width: '100%',
      ...alignment.MTxSmall
    },
    labelTitleContainer: {
      ...alignment.Psmall
    },
    buttonInline: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    labelButton: {
      width: '30%',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'transparent',
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
      ...alignment.PxSmall
    },
    saveBtnContainer: {
      width: '100%',
      height: verticalScale(40),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent'
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
      height: scale(40),
      width: scale(40)
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
