import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

const styles = (props)=> StyleSheet.create({
  headerLeftIcon: {
    ...alignment.MLmedium,
    ...alignment.PxSmall,
    borderRadius: scale(50)
  }
})

export default styles