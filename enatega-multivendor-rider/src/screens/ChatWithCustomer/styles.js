import { StyleSheet } from 'react-native'
import colors from '../../utilities/colors'

export default StyleSheet.create({
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
    marginTop: 300,
    transform: [{ scaleY: -1 }, {scaleX: -1}],
    alignSelf:'center'
  },
  bubbleRight: {
    backgroundColor: colors.black,
    padding: 5,
    marginBottom: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0
  },
  bubbleLeft: {
    backgroundColor: colors.primary,
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15
  }
})
