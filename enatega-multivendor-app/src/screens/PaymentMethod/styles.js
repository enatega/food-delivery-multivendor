import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    borderRadius: 15,
    marginLeft: scale(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    paddingTop: scale(65),
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  methodRow: {
    flexDirection: 'row',
    ...alignment.MBlarge
  },
  methodDescription: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...alignment.MLlarge,
    ...alignment.PTmedium,
    ...alignment.PBmedium,
    ...alignment.PLsmall,
    ...alignment.PRsmall,
    borderRadius: 15
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
export default styles
