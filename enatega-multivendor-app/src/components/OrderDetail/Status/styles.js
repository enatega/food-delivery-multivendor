import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: theme => ({
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 5,
    zIndex: 1,
    elevation: 1,
    backgroundColor: theme.secondaryBackground,
    marginTop: -100
  }),
  statusBox: theme => ({
    backgroundColor: theme.black,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    padding: 10
  }),
  statusList: theme => ({
    padding: 15,
    backgroundColor: theme.secondaryBackground
  }),
  icon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText: {
    marginLeft: 15
  },
  text: {
    marginVertical: 2
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statusRowText: {
    marginLeft: 10
  },
  statusTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
