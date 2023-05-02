import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    paddingTop: scale(65),
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    borderRadius: 15,
    marginLeft: scale(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  voucherInput: {
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
    marginHorizontal: '10%',
    alignSelf: 'stretch',
    ...textStyles.Regular,
    ...textStyles.H4,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: '20%',
    margin: '5%',
    marginVertical: '10%',
    borderRadius: 10
  }
})
export default styles
