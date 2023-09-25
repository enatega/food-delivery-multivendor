import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      flexDirection: 'row'
    },
    homeIcon: {
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    homeIconImg: {
      width: scale(15),
      height: scale(15)
    },
    addressContainer: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: scale(10),
      backgroundColor: props != null ? props.radioOuterColor : 'white',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    addressDetail: {
      width: '80%',
      alignSelf: 'flex-end'
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: 'lightgrey',
      borderBottomWidth: 1,
      ...alignment.MTmedium,
      ...alignment.MBmedium
    }
  })
export default styles
