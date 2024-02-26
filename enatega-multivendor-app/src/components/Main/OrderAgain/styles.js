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
      height: scale(250),
      width: '100%',
      ...alignment.MLlarge,
    },
    ItemDescription:{
      fontWeight:'400',
      marginTop:scale(5),
      marginBottom:scale(7)
    },
    orderAgainSec:{
      marginBottom:scale(30)   

    },
    topPicksSec:{
     
      marginBottom:scale(18),
    }
  })

export default styles
