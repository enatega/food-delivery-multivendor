import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    subContainer: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 20,
      ...alignment.PTlarge
    },
    upperContainer: {
      width: '100%',
      alignItems: 'center'
    },
    addressContainer: {
      paddingTop: 0,
      width: '100%',
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    labelButtonContainer: {
      width: '100%',
      ...alignment.MTxSmall
    },
    labelTitleContainer: {
      ...alignment.Psmall,
      ...alignment.PLlarge
    },
    buttonInline: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      ...alignment.MBmedium
    },
    labelButton: {
      width: '15%',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.tagColor : 'transparent',
      backgroundColor: props !== null ? props.tagColor : 'transparent',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PxSmall
    },
    activeLabel: {
      width: '15%',
      borderWidth: 1,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: props !== null ? props.tagColor : 'transparent',
      backgroundColor: props !== null ? props.menuBar : 'transparent',
      ...alignment.PxSmall
    },
    saveBtnContainer: {
      width: '60%',
      height: verticalScale(40),
      ...alignment.MTlarge,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
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
      height: '30%',
      backgroundColor: 'transparent'
    },
    geoLocation: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    details: {
      backgroundColor: '#ECECEC',
      borderRadius: 10
    },
    header: {
      position: 'absolute',
      borderRadius: 10,
      alignItems: 'center',
      margin: 15
    }
  })
export default styles
