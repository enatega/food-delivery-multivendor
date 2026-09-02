import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain'
  },
  sliderContainer: {
    width: '95%',
    height: 'auto',
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingTop: scale(5),
    paddingBottom: scale(10),
    position: 'relative'
  },
  centerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: scale(15),
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor:  '#f0f0f0'
  },
    addButton: {
      width: '100%',
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: scale(10)
    },
     addressSubContainer: {
      width: '90%',
      alignSelf: 'center',
      flexDirection:  'row',
      alignItems: 'center'
    },
      mL5p: {
          ...alignment.MLsmall
        },
})

export default styles
