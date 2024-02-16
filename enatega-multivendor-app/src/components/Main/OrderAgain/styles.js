import { verticalScale, scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    // ML20: {
    //   ...alignment.MLlarge
    // },
    offerScroll: {
      height: scale(270),
      width: '100%',
      ...alignment.MLlarge,
    },
    ItemDescription:{
      fontWeight:'400',
      marginTop:scale(5),
      marginBottom:scale(7)
    },
    
  })

export default styles
