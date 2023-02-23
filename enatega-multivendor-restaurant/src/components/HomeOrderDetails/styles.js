const Styles = {
  card: {
    display: 'flex',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    padding: 20,
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
  heading: {
    flex: 0.45
  },
  text: {
    flex: 0.55
  },
  itemRowBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  timerBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 10
  }
}

export default Styles
