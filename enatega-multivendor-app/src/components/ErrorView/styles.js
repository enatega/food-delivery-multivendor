import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'

const useStyle = () => {
  return StyleSheet.create({
    errorViewContainer: {
      marginTop: verticalScale(50),
      marginHorizontal: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      padding: 24,
    }
  })
}

export default useStyle
