import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      gap: 24,
      // ...alignment.MBxLarge
      marginVertical : 16
    },
    heading: { 
      marginBottom: 10, 
      paddingHorizontal: 15
    },
    flatlist: {
      alignSelf: 'flex-start',
      flexGrow: 1,
      gap: 8,
      paddingHorizontal: 15
    },
    filterBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 50,
      // borderWidth: 1,
      marginRight: 8,
    },
    applyBtn: {
      width: 'auto',
      backgroundColor: props !== null ? props?.main : '#90E36D',
      padding: 16,
      marginHorizontal: 10,
      borderRadius: 50
    },
    closeBtn: {
      position: 'absolute',
      ...props?.isRTL ? {left: 10,} : {right: 10,},
      top: 10,
      zIndex: 100
    }

  })
export default styles
