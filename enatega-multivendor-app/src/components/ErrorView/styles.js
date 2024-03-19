import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'

const useStyle = () => {
  return StyleSheet.create({
    errorViewContainer: {
      marginTop: verticalScale(30),
      marginHorizontal: scale(10),
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
}

export default useStyle
