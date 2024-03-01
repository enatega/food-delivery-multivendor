import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    rowDisplay: {
      display: 'flex',
      flexDirection: 'row'
    },
    chatSec: {
      flex: 1,

      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    orderDetails: {
      borderColor: props !== null ? props.verticalLine : 'transparent',
      ...alignment.Pmedium,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    orderNoSec: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4)
    },
    orderNo: {
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingVertical: scale(8),
      paddingHorizontal: scale(12),
      borderRadius: 16
    },
    accessoryContainer: {
      height: 100,
      paddingLeft: 20,
      display: 'flex',
      flexDirection: 'row'
    },
    accessoryImg: { height: 40, width: 40, borderRadius: 5 },
    accessoryIcon: {
      marginLeft: -10,
      marginTop: -10,
      position: 'relative',
      elevation: 999
    },

    sendIcon: {
      width: scale(25)
    },

    emptyChat: {
      marginTop: '160%',
      transform: [{ scaleY: -1 }]
    },
    bubbleRight: {
      backgroundColor: '#E4FFD9',
      padding: 5,
      marginBottom: 5,
      borderRadius: 4
    },
    bubbleLeft: {
      backgroundColor: '#F3F4F6',
      padding: 5,
      marginBottom: 5,
      borderRadius: 4
    },
    addImg: {
      width: scale(20)
    }
  })
export default styles
