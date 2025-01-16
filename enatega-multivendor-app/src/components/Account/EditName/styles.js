import { scale, verticalScale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
import { Dimensions } from 'react-native'
const {height} = Dimensions.get('screen')

const styles = (props = null) =>
  StyleSheet.create({
    mainView: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    mainContainer: {
      ...alignment.Pmedium,
      justifyContent: 'space-between',
      height: '100%'
    },
    textField: {
      borderColor: props !== null ? props?.borderColor : '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(6),
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      padding: scale(12),
      color: props !== null ? props?.newFontcolor : 'red',
      ...alignment.MBxSmall,
      textAlign : props?.isRTL ? 'right' : 'left'
    },
    containerButton: {
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      width: '90%',
      height: scale(40),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      ...alignment.MTmedium,
      ...alignment.MBmedium
    },
    addButton: {
      backgroundColor: props !== null ? props?.newheaderColor : 'transparent',
      width: '100%',
      height: scale(40),
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }
  })
export default styles
