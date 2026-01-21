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

      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    orderDetails: {
      borderColor: props !== null ? props?.verticalLine : 'transparent',
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
      backgroundColor: props !== null ? props?.color5 : 'transparent',
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
      marginTop: '140%',
      transform: [
        { scaleY: -1 },
      ]
    },

    textRight: {
      color: '#1F2937',
      padding: 10,
      marginBottom: 5
    },
    textLeft: {
      color: '#1F2937',
      padding: 10,
      marginBottom: 5
    },
    addImg: {
      width: scale(20)
    },
    backButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: props !== null ? props.colorBgTertiary : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
  })
export default styles
