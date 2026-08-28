import { Dimensions, StyleSheet } from 'react-native'

import { scale } from '../../../utils/scaling'

const { height } = Dimensions.get('window')

const styles = theme =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: theme?.singleVendorBrand || '#90E36D',
      borderRadius: scale(8),
      height: height * 0.06,
      justifyContent: 'center',
      width: '100%'
    },
    disabled: {
      backgroundColor: theme?.colorBgTertiary || '#D1D5DB',
      opacity: 0.7
    }
  })

export default styles
