import { Dimensions, Platform, StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      height: '100%',
      width: '100%'
    },
    innerContainer: {
      height: height * 1,
      backgroundColor: props != null ? props.themeBackground : '#FFF',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      shadowColor: props != null ? props.headerText : '#000',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowOpacity: 0.58,
      shadowRadius: 13.0,
      elevation: 24,
      alignItems: 'center',
      ...alignment.MTlarge
    },
    ordersContainer: {
      height: height,
      marginBottom: Platform.OS === 'ios' ? height * 0.4 : height * 0.35,
      ...alignment.MTlarge
    },
    margin500: {
      marginTop: -500
    }
  })
export default styles
