import { StyleSheet } from 'react-native'
import { colors } from '../../utilities'

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    padding: 25,
    paddingTop: 15,
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start'
  },
  heading: {
    flex: 0.4,
    marginTop: 10,
    color: colors.fontSecondColor,
    fontWeight: '700'
  },
  text: {
    flex: 0.6,
    marginTop: 10,
    fontWeight: '700'
  },
  itemRowBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.fontSecondColor,
    marginTop: 10,
    paddingBottom: 5
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemHeading: {
    marginTop: 10
  },
  itemText: {
    marginTop: 10
  }
})

export default styles
