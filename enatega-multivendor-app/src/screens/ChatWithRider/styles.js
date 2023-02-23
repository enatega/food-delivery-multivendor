import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    rowDisplay: {
      display: 'flex',
      flexDirection: 'row'
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
    sendIcon: { marginBottom: 7, marginRight: 10 },
    emptyChat: {
      marginTop: '160%',
      transform: [{ scaleY: -1 }],
      marginLeft: '17%'
    },
    bubbleRight: {
      backgroundColor: props !== null ? props.black : 'transparent',
      padding: 5,
      marginBottom: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 0
    },
    bubbleLeft: {
      backgroundColor: props !== null ? props.iconColorPink : 'transparent',
      padding: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 15
    }
  })
export default styles
