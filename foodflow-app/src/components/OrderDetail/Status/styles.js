import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: theme => ({
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginHorizontal: 5,
    zIndex: 1,
    // elevation: 1,
    backgroundColor: theme.themeBackground,
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
    width: '100%',
    backgroundColor: theme.themeBackground,
    // elevation: 1
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
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
  },
  line2: theme => ({
    marginVertical: 10,
    backgroundColor: theme.secondaryText,
    height: 1,
    width: '100%'
  })
})
