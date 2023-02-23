import { StyleSheet, Dimensions } from 'react-native'
const { height } = Dimensions.get('window')

export default StyleSheet.create({
  transactionHistory: {
    height: height * 0.4
  }
})
