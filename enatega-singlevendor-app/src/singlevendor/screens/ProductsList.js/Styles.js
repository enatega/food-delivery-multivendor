import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    headerLeftIcon: {
      ...alignment.MLmedium,
      ...alignment.Psmall,
      backgroundColor: props !== null ? props?.colorBgTertiary : '#F4F4F5',
      borderRadius: scale(50)
    }
  })

export default styles
