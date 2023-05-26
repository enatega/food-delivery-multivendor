import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'

const { height, width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    map: {
      width: width,
      height: height * 0.6
    },
    screenBackground: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    mainContentContainer: {
      width: '100%',
      height: '100%',
      alignSelf: 'center'
    },
    restaurantsContainer: {
      backgroundColor: '#F3F4F8',
      width: '100%',
      height: '100%',
      borderTopRightRadius: scale(25),
      borderTopLeftRadius: scale(25)
    },
    ML20: {
      ...alignment.MLlarge
    },
    PB10: {
      ...alignment.MBsmall
    },
    mL5p: {
      ...alignment.MLsmall
    },
    addressbtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    addressContainer: {
      width: '100%',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props != null ? props.horizontalLine : 'grey',
      ...alignment.PTmedium,
      ...alignment.PBmedium
    },
    addressSubContainer: {
      width: '90%',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    content: {
      ...alignment.PTlarge
    },
    modal: {
      backgroundColor: props != null ? props.cartContainer : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0
    },
    addressTextContainer: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      ...alignment.PTxSmall
    },
    addressTick: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    handle: {
      width: 150,
      backgroundColor: '#b0afbc'
    },
    relative: {
      position: 'relative'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props.cartContainer : '#B8B8B8',
      borderRadius: 3,
      elevation: 3,
      marginBottom: 12,
      padding: 12
    },
    height200: {
      height: 200
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props.fontSecondColor : '#B8B8B8'
    },
    filterContainer: {
      width: '95%',
      backgroundColor: '#2c2c2c',
      ...alignment.Pmedium,
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20
    },
    aboveFilterContainer: {
      width: '95%',
      backgroundColor: '#2c2c2c',
      ...alignment.Pmedium,
      alignSelf: 'center',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      marginTop: 80
    }
  })
export default styles
