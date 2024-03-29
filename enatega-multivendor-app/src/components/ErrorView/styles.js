import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'

const useStyle = (props) => {
  return StyleSheet.create({
    errorViewContainer: {
      flex:1,
      backgroundColor: props != null ? props.themeBackground : 'white',
      // paddingTop: verticalScale(50),
      // paHorizontal: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      padding: 24,
    }
  })
}

export default useStyle
