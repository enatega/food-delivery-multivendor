import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    textBtn: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
      ...alignment.PBsmall
    },
    modalContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#FAFAFA',
      borderColor: props !== null ? props.tagColor : '#FAFFAA',
      ...alignment.PTmedium,
      ...alignment.PRlarge,
      ...alignment.PLlarge
    },
    modalTextBtn: {
      alignSelf: 'flex-end',
      height: scale(30),
      width: scale(30),
      ...alignment.MTsmall
    },

    headerContainer: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      ...alignment.MTsmall
    },
    textContainer: {
      maxWidth: '75%',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    fieldContainer: {
      width: '90%',
      alignSelf: 'center',
      ...alignment.MTmedium
    },
    line: {
      borderWidth: StyleSheet.hairlineWidth,
      ...alignment.MTmedium,
      ...alignment.MBmedium,
      backgroundColor: props !== null ? props.fontSecondaryColor : '#FAFAFA'
    },
    greenBox: {
      backgroundColor: props !== null ? props.tagColor : '#FAFAFA',
      height: 50,
      borderRadius: 5
    },
    lowerCurrent: {
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center'
    },
    current: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center'
    }
  })
export default styles
