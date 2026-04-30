import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: props !== null ? props?.customBorder : '#E5E7EB',
      borderRadius: scale(8),
      backgroundColor: props !== null ? props?.cardBackground : '#F3F4F6',
      // ...alignment.Msmall,
      ...alignment.Psmall,
    },
    header: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      gap: 10
    },
    heading: {
      width: '90%'
    }
  })
export default styles
