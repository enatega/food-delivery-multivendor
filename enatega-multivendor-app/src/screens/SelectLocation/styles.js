import { StyleSheet, Dimensions } from 'react-native'
const { height: HEIGHT, width: WIDTH } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    // flex: 1,
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    width: '90%',
    marginVertical: '10%',
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 10
  },
  inputContainer: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2
  },
  confirmContainer: {
    position: 'absolute',
    // bottom: 0,
    top: HEIGHT - (HEIGHT / 100) * 15,
    // height: '15%',
    width: '90%',
    alignSelf: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  roundButton: {
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 13,
    paddingLeft: 10,
    marginBottom: 7,
    margin: '5%',
    marginTop: '5%'
  },
  searchBarAutoCompleteContainer: {
    justifyContent: 'center'
  },
  searchBarAutoCompleteInputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: 'black',
    fontSize: 16
  },
  predictionsContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center'
  },
  predictionRow: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  predictionsView: {
    position: 'absolute',
    width: '100%',
    top: HEIGHT - (HEIGHT / 100) * 85
  }
})
export default styles
